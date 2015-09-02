var _ = require('lodash');
var settings = require('./app/config/settings');
var log = require('./app/lib/log');
var fs = require('fs');
var path = require('path');
var webappengine = require('webappengine');
var readline = require('readline');
var motionQueue = require('./motion-queue');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var serverOptions = {
    port: 8000,
    routes: [
        {
            type: 'server',
            route: '/',
            // An absolute path is recommended to use
            server: path.resolve(__dirname, 'app/app')
        }
    ]
};

var stripComments = (function() {
    var re1 = /^\s+|\s+$/g; // Strip leading and trailing spaces
    var re2 = /\s*[#;].*$/g; // Strip everything after # or ; to the end of the line, including preceding spaces
    return function (s) {
        return s.replace(re1, '').replace(re2, '');
    };
}());

function runFive(socket) {
    var five = require('johnny-five');
    var board = new five.Board();

    board.on('ready', function() {
        var servos = {
            base: new five.Servo({
                pin: 3,
                center: true
            }),
            axis1: new five.Servo({
                pin: 5,
                center: true
            }),
            axis2: new five.Servo({
                pin: 6,
                center: true
            }),
            axis3: new five.Servo({
                pin: 9,
                center: true
            }),
            turn: new five.Servo({
                pin: 10,
                center: true
            }),
            claw: new five.Servo({
                pin: 11,
                center: true,
                range: [125, 175]
            })
        };

        socket.on('robot-arm', function(data) {
            servos.base.to(data.base);
            servos.axis1.to(data.axis1);
            servos.axis2.to(data.axis2);
            servos.axis3.to(data.axis3);
            servos.turn.to(data.turn);
            servos.claw.to(data.claw);
        });
    });
}

function server(server) {
    var io = require('socket.io')(server, {
        serveClient: true,
        path: '/socket.io'
    });

    io.on('connection', function(socket) {
        serialport.list(function(err, ports) {
            if (err) {
                log.error(err);
                return;
            }

            log.info('serial ports:', ports);
            socket.emit('serialport:list', ports);
        });

        socket.on('serialport:connect', function(data) {
            var path = data.port;
            var baudrate = Number(data.baudrate);
            var queue = motionQueue();
            var sp = new SerialPort(path, {
                baudrate: baudrate, // defaults to 9600
                parser: serialport.parsers.readline('\n')
            });

            queue.on('data', function(line) {
                line = line.trim();
                console.log(line);
                sp.write(line + '\n');
                socket.emit('serialport:data', line);
            });

            log.debug('SerialPort:', sp);

            setInterval(function() {
                if (sp.isOpen()) {
                    sp.write('?');
                }
            }, 500);

            sp.on('open', function() {
                log.debug('Connected to \'%s\' at %d.', path, baudrate);
                socket.emit('serialport:open', {
                    port: path,
                    baudrate: baudrate
                });
            });

            sp.on('data', function(line){
                line = line.trim();

                console.log('grbl>', line);

                if (line === 'ok') {
                    queue.next();
                } else if (line === 'error') {
                    queue.next();
                } else if (/<[^>]+>/.test(line)){
                    // <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000>
                    var r = line.match(/<(\w+),\w+:([^,]+),([^,]+),([^,]+),\w+:([^,]+),([^,]+),([^,]+)>/);
                    if ( ! r) {
                        return;
                    }

                    // https://github.com/grbl/grbl/wiki/Configuring-Grbl-v0.9#---current-status
                    socket.emit('grbl:status', {
                        activeState: r[1], // Active States: Idle, Run, Hold, Door, Home, Alarm, Check
                        machinePos: { // Machine position
                            x: r[2], 
                            y: r[3],
                            z: r[4]
                        },
                        workingPos: { // Working position
                            x: r[5],
                            y: r[6],
                            z: r[7]
                        }
                    });
                } else {
                    // Others
                }

                socket.emit('serialport:data', 'grbl> ' + line);
            });

            sp.on('close', function() {
                log.debug('The serial port connection is closed.');
            });

            sp.on('error', function() {
                log.error('Error opening serial port \'%s\'', path);
            });

            socket.on('serialport:write', function(data) {
                log.debug('serialport:write: data=%s', data);
                sp.write(data);
            });

            socket.on('serialport:writeln', function(line) {
                log.debug('serialport:writeln: line=%s', line);
                sp.write(line + '\n');
            });

            socket.on('grbl:start', function() {
                var lines = [];

                readline
                    .createInterface({
                        input: fs.createReadStream('./test/github.gcode'),
                        // No output
                        terminal: false
                    })
                    .on('line', function(line) {
                        line = stripComments(line);
                        if (line.length === 0) {
                            return;
                        }
                        lines.push(line);
                    })
                    .on('close', function() {
                        queue.add(lines);
                        queue.start();
                    });
            });

            socket.on('grbl:pause', function() {
                queue.pause();
            });

            socket.on('grbl:resume', function() {
                queue.resume();
            });

            socket.on('grbl:reset', function() {
                queue.reset();
            });

        });

    });
}

webappengine(serverOptions)
    .on('ready', server);

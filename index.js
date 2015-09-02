var _ = require('lodash');
var settings = require('./app/config/settings');
var log = require('./app/lib/log');
var fs = require('fs');
var path = require('path');
var webappengine = require('webappengine');
var readline = require('readline');
var motionQueue = require('./motion-queue');
var serialport = require('serialport');
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

var sockets = [];
var serialPortList = [];

serialport.list(function(err, ports) {
    if (err) {
        log.error(err);
        return;
    }

    serialPortList = _.map(ports, function(port) {
        return {
            port: port,
            queue: motionQueue(),
            sockets: [],
            serialPort: null
        };
    });

    log.info('serial ports:', ports);
    //socket.emit('serialport:list', ports);
});

var newSerialPort = function(options, callback) {
    var serialPort = new SerialPort(options.path, {
        parser: serialport.parser.readline('\n'),
        baudrate: options.baudrate
    });

    serialport.on('open', function(callback) {
        log.debug('Connected to \'%s\' at %d.', path, baudrate);

        callback(serialPort, data);
    });

    return serialport;
};

function server(server) {
    var io = require('socket.io')(server, {
        serveClient: true,
        path: '/socket.io'
    });

    io.on('connection', function(socket) {
        sockets.push(socket);
        log.debug('socket.io: connected', { id: socket.id, connected: _.size(sockets) });

        socket.on('disconnect', function() {
            sockets = _.remove(sockets, function(_socket) {
                return _socket === socket;
            });
            log.debug('socket.io: disconnected', { id: socket.id, connected: _.size(sockets) });
        });

        /*
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

            if ( ! sp) {
                sp = new serialport.SerialPort(path, {
                    baudrate: baudrate, // defaults to 9600
                    parser: serialport.parsers.readline('\n')
                });
            }

            log.info('Starting a new serial port connection: sockets=%d', sockets.length);

            queue.on('data', function(line) {
                line = line.trim();
                console.log(line);
                sp.write(line + '\n');
                socket.emit('serialport:data', line);
            });

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
        */

    });
}

webappengine(serverOptions)
    .on('ready', server);

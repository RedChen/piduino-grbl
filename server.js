var _ = require('lodash');
var log = require('./app/lib/log');
var fs = require('fs');
var readline = require('readline');
var queue = require('./motion-queue');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;

var stripComments = (function() {
    var re1 = /^\s+|\s+$/g; // Strip leading and trailing spaces
    var re2 = /\s*[#;].*$/g; // Strip everything after # or ; to the end of the line, including preceding spaces
    return function (s) {
        return s.replace(re1, '').replace(re2, '');
    };
}());

var serialports = {};

module.exports = function(server) {
    var io = require('socket.io')(server, {
        serveClient: true,
        path: '/socket.io'
    });

    io.on('connection', function(socket) {
        log.debug('io.on(\'connection\'):', { id: socket.id });

        socket.on('disconnect', function() {
            // Remove the socket of the disconnected client
            _.each(serialports, function(sp) {
                sp.sockets = _.remove(sp.sockets, function(_socket) {
                    return _socket === socket;
                });
            });
            log.debug('socket.on(\'disconnect\'):', { id: socket.id });
        });

        serialport.list(function(err, ports) {
            if (err) {
                log.error(err);
                return;
            }

            var portsInUse = _(serialports)
                .filter(function(sp) {
                    return sp && sp.serialPort && sp.serialPort.isOpen();
                })
                .map(function(sp) {
                    return sp.port;
                })
                .value();
            
            ports = _.map(ports, function(port) {
                return {
                    port: port.comName,
                    manufacturer: port.manufacturer,
                    inuse: _.includes(portsInUse, port.comName) ? true : false
                };
            });

            log.info('serialport.list():', ports);
            socket.emit('serialport:list', ports);
        });

        socket.on('serialport:connect', function(data) {
            var port = _.get(data, 'port');

            serialports[port] = serialports[port] || {
                port: port,
                queue: queue(),
                sockets: []
            };

            if ( ! _.includes(serialports[port].sockets, socket)) {
                serialports[port].sockets.push(socket);
            }

            if ( ! serialports[port].serialPort) {
                try {
                    var baudrate = Number(_.get(data, 'baudrate')) || 9600; // defaults to 9600
                    var serialPort = new SerialPort(port, {
                        baudrate: baudrate,
                        parser: serialport.parser.readline('\n')
                    });

                    serialports[port].serialPort = serialPort;

                    serialPort.on('open', function(err) {
                        log.debug('Connected to \'%s\' at %d.', port, baudrate);
                    });

                    serialPort.on('close', function(err) {
                        log.debug('The serial port connection is closed.');

                        delete serialports[port];
                        serialports[port] = undefined;
                    });

                    serialPort.on('error', function() {
                        log.error('Error opening serial port \'%s\'', port);
                    });

                }
                catch (err) {
                    log.error(err);

                    // clear sockets on errors
                    serialports.sockets = [];
                }
            }

            log.debug('socket.on(\'serial-connect\'):', serialports[port]);
        });

    });


        /*
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
};

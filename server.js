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

var isOpen = function(sp) {
    return sp && sp.serialPort && sp.serialPort.isOpen();
};

var parseSerialMsg = function(sp, msg) {
    msg = ('' + msg).trim();

    console.log('grbl>', msg);

    if (msg === 'ok') {
        sp.queue.next();
    } else if (msg === 'error') {
        sp.queue.next();
    } else if (/<[^>]+>/.test(msg)){
        // <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000>
        var r = msg.match(/<(\w+),\w+:([^,]+),([^,]+),([^,]+),\w+:([^,]+),([^,]+),([^,]+)>/);
        if ( ! r) {
            return;
        }

        // https://github.com/grbl/grbl/wiki/Configuring-Grbl-v0.9#---current-status
        sp.sockets.emit('grbl:current-status', {
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

        return;
    } else {
        // Others
    }

    sp.sockets.emit('serialport:msg', 'grbl> ' + msg);
};

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
                sp.sockets.list = _.remove(sp.sockets.list, function(_socket) {
                    return _socket === socket;
                });
            });
            log.debug('socket.on(\'disconnect\'):', { id: socket.id });
        });

        socket.on('serialport:connect', function(data) {
            var port = _.get(data, 'port');
            var sp = serialports[port] = serialports[port] || {
                port: port,
                sockets: {
                    emit: (function(port) {
                        return function(evt, msg) {
                            _.each(sp.sockets.list, function(_socket) {
                                _socket.emit(evt, msg);
                            });
                        };
                    })(port),
                    list: []
                }
            };

            if ( ! sp.queue) {
                sp.queue = queue();
                sp.queue.on('data', function(msg) {
                    console.log(msg);
                    msg = ('' + msg).trim();
                    sp.write(msg + '\n');
                    sp.sockets.emit('serialport:msg', msg);
                });
            }

            if ( ! _.includes(sp.sockets.list, socket)) {
                sp.sockets.list.push(socket);
            }

            if ( ! sp.serialPort) {
                try {
                    var baudrate = Number(_.get(data, 'baudrate')) || 9600; // defaults to 9600
                    var serialPort = new SerialPort(port, {
                        baudrate: baudrate,
                        parser: serialport.parser.readline('\n')
                    });

                    sp.serialPort = serialPort;

                    serialPort.on('open', function() {
                        log.debug('Connected to \'%s\' at %d.', port, baudrate);
                    });

                    serialPort.on('data', function(msg) {
                        parseSerialMsg(sp, msg);
                    });

                    serialPort.on('close', function() {
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
                    sp.sockets.list = [];
                }
            }

            log.debug('socket.on(\'serial-connect\'):', serialports[port]);
        });

        socket.on('serialport:write', function(port, msg) {
            var sp = serialports[port];
            if ( ! isOpen(sp)) {
                log.warn('The serial port is not open.', { port: port });
                return;
            }

            log.debug('socket.on(\'serialport:write\'):', { id: socket.id, port: port, msg: msg });
            sp.write(msg);
        });

        socket.on('serialport:writeln', function(port, msg) {
            var sp = serialports[port];
            if ( ! isOpen(sp)) {
                log.warn('The serial port is not open.', { port: port });
                return;
            }

            log.debug('socket.on(\'serialport:writeln\'):', { id: socket.id, port: port, msg: msg });
            msg = ('' + msg).trim();
            sp.write(msg + '\n');
        });

        socket.on('grbl:start', function(port) {
            var sp = serialports[port];
            if ( ! isOpen(sp)) {
                log.warn('The serial port is not open.', { port: port });
                return;
            }

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
                    sp.queue.add(lines);
                    sp.queue.start();
                });
        });

        socket.on('grbl:pause', function(port) {
            var sp = serialports[port];
            if ( ! isOpen(sp)) {
                log.warn('The serial port is not open.', { port: port });
                return;
            }

            sp.queue.pause();
        });

        socket.on('grbl:resume', function(port) {
            var sp = serialports[port];
            if ( ! isOpen(sp)) {
                log.warn('The serial port is not open.', { port: port });
                return;
            }

            sp.queue.resume();
        });

        socket.on('grbl:reset', function(port) {
            var sp = serialports[port];
            if ( ! isOpen(sp)) {
                log.warn('The serial port is not open.', { port: port });
                return;
            }

            sp.queue.reset();
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

    });
};

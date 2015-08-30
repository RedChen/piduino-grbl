var _ = require('lodash');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var fs = require('fs');
var readline = require('readline');
var queueCommander = require('./queue-commander');

var config = {
    baudrate: 115200
};

var stripComments = (function() {
    var re1 = /^\s+|\s+$/g; // Strip leading and trailing spaces
    var re2 = /\s*[#;].*$/g; // Strip everything after # or ; to the end of the line, including preceding spaces
    return function (s) {
        return s.replace(re1, '').replace(re2, '');
    };
}());

serialport.list(function(err, ports) {
    console.log(ports);

    var port = _.findWhere(ports, { comName: '/dev/ttyUSB0' });

    if ( ! port) {
        process.exit(-1);
        return;
    }

    var sp = new SerialPort(port.comName, {
        parser: serialport.parsers.readline('\n'),
        baudrate: config.baudrate 
    });
    var commander = queueCommander();

    commander.on('data', function(line) {
        line = line.trim();
        console.log(line);
        sp.write(line + '\n');
    });

    sp.on('open', function() {
        console.log('Connected to %s at %d.', port.comName, config.baudrate);
    });

    sp.on('data', function(line){
        line = line.trim();

        console.log('grbl>', line);

        if (line === 'ok') {
            commander.next();
        } else if (line === 'error') {
            commander.next();
        } else if (/<[^>]+>/.test(line)){
            // <Idle,MPos:0.000,0.000,0.000,WPos:0.000,0.000,0.000>
            var r = line.match(/<(\w+),\w+:([^,]+),([^,]+),([^,]+),\w+:([^,]+),([^,]+),([^,]+)>/);
            if ( ! r) {
                return;
            }

            // https://github.com/grbl/grbl/wiki/Configuring-Grbl-v0.9#---current-status
            var status = {
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
            };
        } else {
            // Others
        }
    });

    readline
        .createInterface({
            input: process.stdin,
            // No output
            terminal: false
        })
        .on('line', function(line){
            line = line.trim();
            if (line.length === 0) {
                return;
            }

            if (line === '#run') {
                var lines = [];

                readline
                    .createInterface({
                        input: fs.createReadStream('./github.gcode'),
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
                        commander.load(lines);
                        commander.start();
                    });

            } else if (line === '#pause') {
                commander.pause();
            } else if (line === '#resume') {
                commander.resume();
            } else if (line === '#stop') {
                commander.stop();
            } else if (line === '#reset') {
                // Ctrl+x
                sp.write('\030');
            } else {
                sp.write(line + '\n');
            }
        })
        .on('close', function(){
            process.exit(0);
        });

    setInterval(function() {
        sp.write('?');
    }, 1000);
});

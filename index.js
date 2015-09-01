var _ = require('lodash');
var path = require('path');
var webappengine = require('webappengine');
var serialport = require('serialport');
var options = {
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

webappengine(options)
    .on('ready', function(server) {
        var io = require('socket.io')(server, {
            serveClient: true,
            path: '/socket.io'
        });

        io.on('connection', function(socket) {

            runFive(socket);

            serialport.list(function(err, ports) {
                if (err) {
                    console.error(err);
                    return;
                }
                socket.emit('serial-ports', ports);
            });


            socket.emit('server-config', {});
           
            socket.on('start', function() {
            });

            socket.on('pause', function() {
            });

            socket.on('resume', function() {
            });

            socket.on('disconnect', function() {
            });
        });

    });

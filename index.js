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

webappengine(options)
    .on('ready', function(server) {
        var io = require('socket.io')(server, {
            serveClient: true,
            path: '/socket.io'
        });

        io.on('connection', function(socket) {

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

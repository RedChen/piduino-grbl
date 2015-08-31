var path = require('path');
var webappengine = require('webappengine');
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
        var io = require('socket.io')(server);
    });

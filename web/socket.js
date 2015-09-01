import log from './lib/log';

let socket = root.io.connect('');

socket.on('connect', () => {
    log.info('socket.io: connected');
});
socket.on('error', () => {
    log.error('socket.io: error');
    socket.destroy();
});
socket.on('close', () => {
    log.info('socket.io: closed');
});

export default socket;

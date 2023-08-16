const io = require('socket.io')({
  cors: '*',
});
const socketapi = {
  io: io,
};

global['io'] = io;

// Add your socket.io logic here!
io.on('connection', function (socket) {
  console.log('a user is connected!');
  socket.on('disconnect', () => {
    console.log('a user disconneted!');
  });
});

// end of socket.io logic

module.exports = socketapi;

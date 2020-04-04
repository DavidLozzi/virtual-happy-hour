import io from 'socket.io-client';
import CONFIG from 'config'

const endpoint = CONFIG.URLS.SOCKET;
const socketClient = io(endpoint, { forceNew: true });
socketClient.on('error', (error) => {
  console.log('socket error', error);
});

export default socketClient;
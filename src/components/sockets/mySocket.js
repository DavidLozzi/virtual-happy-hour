import io from 'socket.io-client';
import CONFIG from 'config'

const endpoint = CONFIG.URLS.SOCKET;
const socketClient = io(endpoint, { forceNew: true });

export default socketClient;
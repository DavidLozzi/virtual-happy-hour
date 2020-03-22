import socketIOClient from "socket.io-client";

const endpoint = "http://localhost:3001";
export default socketIOClient(endpoint);
import socketIOClient from "socket.io-client";

const endpoint = "https://api.virtualhappyhour.app"; // https://34.219.76.202"; // "http://34.219.76.202/";
export default socketIOClient(endpoint);
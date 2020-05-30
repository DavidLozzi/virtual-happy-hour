export default {
  ENV: process.env.REACT_APP_ENV,
  URLS: {
    SOCKET: process.env.REACT_APP_SOCKET_URL
  },
  CONVERSATION_DEFAULTS: (convoNumber, roomName, roomTitle) => ({
    height: 600,
    width: 800,
    convoNumber,
    convoName: `lozzi-${roomName}-${convoNumber}`,
    roomName,
    loading: true,
    roomTitle,
    roomCss: ''
  })
}
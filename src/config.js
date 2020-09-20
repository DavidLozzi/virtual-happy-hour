export default {
  ENV: process.env.REACT_APP_ENV,
  URLS: {
    SOCKET: process.env.REACT_APP_SOCKET_URL
  },
  CONVERSATION_DEFAULTS: (convoNumber, roomName, roomTitle, brandTitle) => ({
    height: 600,
    width: 800,
    convoNumber,
    roomName,
    loading: true,
    roomTitle,
    roomCss: '',
    brandTitle,
    persist: false
  })
}
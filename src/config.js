export default {
  CONVERSATION_DEFAULTS: (convoNumber, roomName, roomTitle) => ({
    height: 300,
    width: 300,
    convoNumber,
    roomName: `lozzi-${roomName}-${convoNumber}`, // actually this is convo name, but Jitsi calls it rooms
    lobbyName: roomName,
    loading: true,
    roomTitle,
    roomCss: '',
    canResize: true,
    hosts: [],
    participants: []
  })
}
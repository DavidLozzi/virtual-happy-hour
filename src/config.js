export default {
  CONVERSATION_DEFAULTS: (roomNumber, roomName, roomTitle) => ({
    height: 300,
    width: 300,
    roomNumber,
    roomName: `lozzi-${roomName}-${roomNumber}`,
    loading: true,
    roomTitle: roomTitle,
    roomCss: '',
    canResize: true,
    participants: []
  })
}
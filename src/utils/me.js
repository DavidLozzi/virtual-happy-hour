import { name as RoomName, actions as RoomActions } from 'redux/api/room/room';
import { name as MeName, actions as MeActions } from 'redux/api/me/me';
import store from 'redux/store';

export const checkAndUpdatePrimaryConvoNumber = () => {
  const me = store.getState()[MeName].participant;
  if (me.userId && me.name) {
    const room = store.getState()[RoomName].room;
    // console.log('checkAndUpdatePrimaryConvoNumber', me.userId, room);
    if (room.participants.some(p => p.userId === me.userId)) {
      const myNumber = room.participants.find(p => p.userId === me.userId).primaryConvoNumber;
      if (myNumber !== me.primaryConvoNumber) {
        MeActions.setPrimaryConvoNumber(myNumber)(store.dispatch);
      }
    } else {
      if (room && room.roomName && room.conversations && room.conversations.length > 0) {
        RoomActions.addParticipant(room.conversations[0], me)(store.dispatch);
      } else {
        window.location.reload();
      }
    }
  }
}

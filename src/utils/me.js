import { name as RoomName } from 'redux/api/room/room';
import { name as MeName, actions as MeActions } from 'redux/api/me/me';
import store from 'redux/store';

export const checkAndUpdatePrimaryConvoNumber = () => {
  const me = store.getState()[MeName].participant;
  const room = store.getState()[RoomName].room;
  if (room.participants.some(p => p.email === me.email)) {
    const myNumber = room.participants.find(p => p.email === me.email).primaryConvoNumber;
    if (myNumber !== me.primaryConvoNumber) {
      MeActions.setPrimaryConvoNumber(myNumber)(store.dispatch);
    }
  }
}
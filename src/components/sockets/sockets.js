import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import mySocket from 'components/sockets/mySocket';

const Sockets = () => {
  const [convos, setConvos] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [createdDate, setCreatedDate] = useState();

  useEffect(() => {
    // mySocket.on("RoomDetails", data => {
    //   setConvos(data.conversations);
    //   setRoomName(data.roomName);
    //   setCreatedDate(data.created);
    // });
  }, [])

  // const clear = () => {
  //   mySocket.emit('ClearConvos');
  // }

  // const clearRoom = () => {
  //   mySocket.emit('ClearRoom');
  // }

  return (
    <div style={{ fontSize: '12px', marginTop: '50px' }}>
      {roomName} Room Details<br />
      Created {dayjs(createdDate).fromNow()}
      <div>Convos underway:<br />
        {convos && convos.map(c => (
          <div key={c.convoNumber}>#{c.convoNumber}. {c.roomName} ({c.participants.length} peeps)</div>
        ))}
      </div>
      <div>
        <br />no warning provided
        <button onClick={clear}>clear convos</button>
        <button onClick={clearRoom}>clear room</button>
      </div>
    </div>
  )
};

export default Sockets;
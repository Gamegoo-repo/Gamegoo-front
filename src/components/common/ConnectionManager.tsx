'use client'

import { socket } from '@/socket';
import React from 'react';


export function ConnectionManager() {
  function connect() {
    socket.connect();
    // console.log(socket.id)
    // const socketId = socket.id || ''
    // localStorage.setItem('gamegooSocketId', socketId)
  }

  function disconnect() {
    socket.disconnect();
    // localStorage.removeItem('gamegooSocketId')
  }

  return (
    <>
      <button onClick={connect}>Connect 버튼입니다</button>
      <br></br>
      <button onClick={disconnect}>Disconnect 버튼입니다</button>
    </>
  );
}
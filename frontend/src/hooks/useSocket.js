import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function useSocket(onProposalUpdate, onContractUpdate) {
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    if (onProposalUpdate) socket.on('proposal:update', onProposalUpdate);
    if (onContractUpdate) socket.on('contract:update', onContractUpdate);

    return () => {
      socket.disconnect();
    };
  }, [onProposalUpdate, onContractUpdate]);

  const joinChat = (roomId) => socketRef.current?.emit('chat:join', roomId);
  const sendMessage = (roomId, content) =>
    socketRef.current?.emit('chat:send', { roomId, content });
  const onMessage = (cb) => {
    socketRef.current?.on('chat:message', cb);
    return () => socketRef.current?.off('chat:message', cb);
  };
  const onGigNew = (cb) => {
    socketRef.current?.on('gig:new', cb);
    return () => socketRef.current?.off('gig:new', cb);
  };

  return { joinChat, sendMessage, onMessage, onGigNew, socket: socketRef };
}

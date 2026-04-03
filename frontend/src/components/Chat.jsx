import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // 상대 경로(같은 도메인)의 Socket 통신으로 변경
    socketRef.current = io();

    // 서버에 접속했음을 알림
    socketRef.current.emit('join', username);

    // 메시지 수신 리스너
    socketRef.current.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [username]);

  // 새로운 메시지가 추가될 때마다 자동으로 스크롤 내리기 (Scroll to bottom)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      socketRef.current.emit('sendMessage', { text: input });
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.type === 'notification' ? (
              <span>{msg.text}</span>
            ) : (
              <>
                <span className="user">{msg.username}: </span>
                <span className="text">{msg.text}</span>
                <span className="time">({msg.time})</span>
              </>
            )}
          </div>
        ))}
        {/* 스크롤을 위치시킬 빈 요소 */}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </div>
  );
};

export default Chat;

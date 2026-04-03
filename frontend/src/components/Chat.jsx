import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const Chat = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Firestore 'chats' 컬렉션에서 메시지 시간 순으로 가져오기
    const q = query(collection(db, 'chats'), orderBy('createdAt', 'asc'));
    
    // 실시간 리스너 연결
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    // 시스템 메시지: 본인 로그인 시 알림 (소켓 연결시 모두에게 브로드캐스트 하던 것을 로컬 알림으로 변경)
    // 영구 기록을 원하면 Firestore에 addDoc으로 type: 'notification' 을 넣을 수 있으나 
    // 여기서는 메시지 로그만 영구 저장합니다.
    
    return () => {
      unsubscribe();
    };
  }, []);

  // 새로운 메시지가 추가될 때마다 자동으로 스크롤 내리기
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;
    
    const textToSend = input;
    setInput(''); // 입력창 미리 비우기

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      await addDoc(collection(db, 'chats'), {
        type: 'message',
        username: username,
        text: textToSend,
        time: timeString,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("채팅 전송 에러:", error);
      alert("Firebase 데이터베이스 오류가 발생했습니다.");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={msg.id || index} className={`message ${msg.type || 'message'}`}>
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
        <button onClick={sendMessage} style={{ backgroundColor: 'var(--main-color)', fontFamily: 'inherit' }}>전송</button>
      </div>
    </div>
  );
};

export default Chat;

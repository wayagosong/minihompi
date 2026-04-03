import { useState } from 'react'
import Layout from './components/Layout'
import Chat from './components/Chat'
import Guestbook from './components/Guestbook'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'guestbook'
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (name) => {
    if (name.trim()) {
      setUsername(name);
      setIsJoined(true);
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {!isJoined ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>비니송이 미니홈피에 오신 것을 환영합니다!</h2>
          <p>사용하실 닉네임을 입력해주세요.</p>
          <input 
            type="text" 
            placeholder="닉네임" 
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleJoin(e.target.value);
            }}
            style={{ padding: '8px', marginRight: '5px' }}
            id="nickname-input"
          />
          <button 
            onClick={() => handleJoin(document.getElementById('nickname-input').value)}
            style={{ padding: '8px 15px', background: '#2da4ce', color: 'white', border: 'none', cursor: 'pointer' }}
          >
            입장
          </button>
        </div>
      ) : (
        <>
          {activeTab === 'chat' && <Chat username={username} />}
          {activeTab === 'guestbook' && <Guestbook username={username} />}
        </>
      )}
    </Layout>
  )
}

export default App

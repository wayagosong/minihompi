import { useState } from 'react'
import Layout from './components/Layout'
import Chat from './components/Chat'
import Guestbook from './components/Guestbook'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'guestbook'
  
  // 로그인 상태 관리
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState('비니');

  const handleLogin = () => {
    // 간단한 하드코딩 비밀번호 (실제 서비스에서는 백엔드/DB 연동 필요)
    if (password === '1234') {
      setUsername(selectedAccount);
      setIsJoined(true);
    } else {
      alert('비밀번호가 틀렸습니다!');
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} username={username}>
      {!isJoined ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2 style={{ color: 'var(--main-color)' }}>비니송이 미니홈피</h2>
          <p>비밀번호를 입력하고 접속해주세요!</p>
          
          <div style={{ margin: '20px auto', display: 'flex', flexDirection: 'column', gap: '10px', width: '200px' }}>
            <select 
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)}
              style={{ padding: '8px', fontSize: '1.2em', fontFamily: 'inherit' }}
            >
              <option value="비니">비니 🧑</option>
              <option value="송이">송이 👧</option>
            </select>
            
            <input 
              type="password" 
              placeholder="비밀번호" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLogin();
              }}
              style={{ padding: '8px', fontSize: '1.1em', fontFamily: 'inherit' }}
            />
            
            <button 
              onClick={handleLogin}
              style={{ padding: '10px', background: 'var(--main-color)', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontSize: '1.1em', fontFamily: 'inherit' }}
            >
              로그인
            </button>
          </div>
          <p style={{ fontSize: '0.8em', color: '#888' }}>임시 비밀번호: 1234</p>
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

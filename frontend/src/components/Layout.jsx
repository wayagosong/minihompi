import React from 'react';

const Layout = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="minihompi-container">
      <div className="minihompi-inner">
        
        {/* 프로필 영역 */}
        <div className="profile-section">
          <div className="profile-img-placeholder">
            <span>사진</span>
          </div>
          <p><strong>비니송이</strong></p>
          <p style={{ fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
            우리의 소중한 추억을 기록하는 공간입니다 ♥
          </p>
        </div>

        {/* 본문 영역 */}
        <div className="content-section">
          <div className="content-header">
            {activeTab === 'chat' ? '실시간 다이어리 (채팅)' : '사진첩 & 방명록'}
          </div>
          <div className="main-content">
            {children}
          </div>

          {/* 오른쪽 메뉴 (네비게이션) */}
          <div className="nav-menu">
            <div 
              className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              채팅
            </div>
            <div 
              className={`nav-item ${activeTab === 'guestbook' ? 'active' : ''}`}
              onClick={() => setActiveTab('guestbook')}
            >
              방명록
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { db } from '../firebase/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Guestbook = ({ username }) => {
  const [entries, setEntries] = useState([]);
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]); // Base64 data strings for mock uploading

  // Fetch from Firestore
  useEffect(() => {
    // Note: This will error out if Firebase config is invalid.
    // For demo purposes and until config is added, we catch errors.
    try {
      const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEntries(data);
      }, (error) => {
        console.error("Firebase connection error. Check your config:", error);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase is not initialized properly. Showing mock data.");
      setEntries([
        { id: 1, author: '시스템', content: 'Firebase 연동을 기다리는 중입니다.', images: [], createdAt: null }
      ]);
    }
  }, []);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const compressedImages = [];

    // 압축 옵션: 1MB 이하 설정
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    };

    for (let file of files) {
      try {
        const compressedFile = await imageCompression(file, options);
        // Firestore에 직접 넣기 위해 Base64로 변환 (주의: 실서비스 시 Storage 사용 권장)
        const base64 = await convertBase64(compressedFile);
        compressedImages.push(base64);
      } catch (error) {
        console.log('Image compression error:', error);
      }
    }
    setImages(prev => [...prev, ...compressedImages]);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim() === '' && images.length === 0) return;

    try {
      await addDoc(collection(db, 'guestbook'), {
        author: username,
        content: content,
        images: images,
        createdAt: serverTimestamp()
      });
      setContent('');
      setImages([]);
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Firebase 설정이 필요합니다.");
    }
  };

  return (
    <div className="guestbook-container">
      <form onSubmit={handleSubmit} className="guestbook-form">
        <h4>방명록 남기기</h4>
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="여기에 글을 남겨주세요!"
          rows="3"
          style={{ width: '100%', marginBottom: '10px', resize: 'vertical' }}
        />
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageChange}
            id="file-upload"
          />
          <button type="submit" style={{ padding: '8px 15px', background: '#2da4ce', color: 'white', border: 'none', cursor: 'pointer' }}>등록</button>
        </div>
        {images.length > 0 && <p style={{ fontSize: '0.8em', color: 'green' }}>{images.length}장의 사진이 첨부되었습니다 (1MB 이하 압축 완료).</p>}
      </form>

      <div className="guestbook-list">
        {entries.map(entry => (
          <div key={entry.id} className="entry">
            <div style={{ fontWeight: 'bold', color: '#1a7b9c' }}>{entry.author}</div>
            <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '10px' }}>
              {entry.createdAt?.toDate ? entry.createdAt.toDate().toLocaleString() : '최근 작성'}
            </div>
            <div>{entry.content}</div>
            
            {/* 여러 장의 이미지 표시 (Swiper 캐러셀) */}
            {entry.images && entry.images.length > 0 && (
              <Swiper
                pagination={{ type: 'fraction' }}
                navigation={true}
                modules={[Pagination, Navigation]}
                className="mySwiper"
              >
                {entry.images.map((imgSrc, i) => (
                  <SwiperSlide key={i}>
                    <img src={imgSrc} alt={`attached-${i}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guestbook;

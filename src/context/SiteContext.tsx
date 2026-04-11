import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, SiteSettings, ContactInquiry } from '../types';

// Firebase 연결을 위한 필수 모듈 임포트
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

// ==========================================
// [중요] Firebase 설정 영역
// 본인의 실제 Firebase 프로젝트 정보입니다.
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyALnxE0MRaudPrQ7CbqGsYKGHTCeuMFrp0",
  authDomain: "boheampago-de893.firebaseapp.com",
  projectId: "boheampago-de893",
  storageBucket: "boheampago-de893.firebasestorage.app",
  messagingSenderId: "330850678315",
  appId: "1:330850678315:web:02f57ae955b74463549c6e",
  measurementId: "G-ZXV0VHFDTR"
};

// 데이터베이스 내 저장 폴더(경로) 고정
// AI Studio 우회 코드를 삭제하고, 항상 정식 창고만 바라보도록 수정
const canvasAppId = 'boheompago-app';

// Firebase 앱, 인증, DB 초기화
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

interface SiteContextType {
  settings: SiteSettings;
  posts: Post[];
  inquiries: ContactInquiry[];
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  addPost: (post: Omit<Post, 'id'>) => void;
  updatePost: (id: string, post: Partial<Post>) => void;
  deletePost: (id: string) => void;
  addInquiry: (inquiry: Omit<ContactInquiry, 'id' | 'date' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: ContactInquiry['status']) => void;
}

// DB에 데이터가 없을 때 띄워줄 기본값 세팅
const defaultSettings: SiteSettings = {
  name: '보험파고',
  heroTitle: '분석의 깊이가 보상의 크기를 결정합니다.',
  heroSubtitle: '15년 경력의 보험보상 전문가가 당신의 곁에서 함께합니다.',
  pointColor: '#064E3B', 
  fontFamily: 'Pretendard, Noto Sans KR, sans-serif',
  logoUrl: 'https://picsum.photos/seed/logo/200/60',
  kakaoUrl: 'https://open.kakao.com/o/s388apqh', 
  instagramUrl: 'https://www.threads.com/@boheampago',
  youtubeUrl: 'https://www.youtube.com/'
};

const defaultPosts: Post[] = []; // DB에서 불러올 예정이므로 초기값은 빈 배열

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) throw new Error('useSite must be used within a SiteProvider');
  return context;
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  
  // 상태 관리 (로컬 스토리지가 아닌 이 상태들을 Firebase와 동기화합니다)
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // 1. 사용자 인증 (Firestore 보안 규칙 대응)
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 2. Firebase 실시간 데이터 구독 (수정 즉시 화면 반영)
  useEffect(() => {
    if (!user) return; // 인증되지 않으면 데이터를 부르지 않음

    // 설정(Settings) 실시간 연결
    const settingsRef = doc(db, 'artifacts', canvasAppId, 'public', 'data', 'settings', 'main');
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      } else {
        setDoc(settingsRef, defaultSettings); // 최초 세팅
      }
    }, (err) => console.error("Settings Load Error:", err));

    // 게시물(Posts/Cases) 실시간 연결
    const postsRef = collection(db, 'artifacts', canvasAppId, 'public', 'data', 'posts');
    const unsubPosts = onSnapshot(postsRef, (querySnap) => {
      const fetchedPosts: Post[] = [];
      querySnap.forEach(doc => {
        fetchedPosts.push({ id: doc.id, ...doc.data() } as Post);
      });
      // 최신순 정렬
      fetchedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setPosts(fetchedPosts);
    }, (err) => console.error("Posts Load Error:", err));

    // 문의 내역(Inquiries) 실시간 연결
    const inquiriesRef = collection(db, 'artifacts', canvasAppId, 'public', 'data', 'inquiries');
    const unsubInquiries = onSnapshot(inquiriesRef, (querySnap) => {
      const fetchedInquiries: ContactInquiry[] = [];
      querySnap.forEach(doc => {
        fetchedInquiries.push({ id: doc.id, ...doc.data() } as ContactInquiry);
      });
      // 최신순 정렬
      fetchedInquiries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setInquiries(fetchedInquiries);
    }, (err) => console.error("Inquiries Load Error:", err));

    // 컴포넌트가 언마운트될 때 리스너 해제
    return () => {
      unsubSettings();
      unsubPosts();
      unsubInquiries();
    };
  }, [user]);

  // 3. 데이터를 DB에 저장하는 함수들
  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    if (!user) return;
    const settingsRef = doc(db, 'artifacts', canvasAppId, 'public', 'data', 'settings', 'main');
    await setDoc(settingsRef, newSettings, { merge: true });
  };

  const addPost = async (postData: Omit<Post, 'id'>) => {
    if (!user) return;
    const postsRef = collection(db, 'artifacts', canvasAppId, 'public', 'data', 'posts');
    await addDoc(postsRef, postData);
  };

  const updatePost = async (id: string, postData: Partial<Post>) => {
    if (!user) return;
    const postRef = doc(db, 'artifacts', canvasAppId, 'public', 'data', 'posts', id);
    await updateDoc(postRef, postData);
  };

  const deletePost = async (id: string) => {
    if (!user) return;
    const postRef = doc(db, 'artifacts', canvasAppId, 'public', 'data', 'posts', id);
    await deleteDoc(postRef);
  };

  const addInquiry = async (inquiryData: Omit<ContactInquiry, 'id' | 'date' | 'status'>) => {
    if (!user) return;
    const inquiriesRef = collection(db, 'artifacts', canvasAppId, 'public', 'data', 'inquiries');
    await addDoc(inquiriesRef, {
      ...inquiryData,
      date: new Date().toISOString().split('T')[0],
      status: 'new'
    });
  };

  const updateInquiryStatus = async (id: string, status: ContactInquiry['status']) => {
    if (!user) return;
    const inquiryRef = doc(db, 'artifacts', canvasAppId, 'public', 'data', 'inquiries', id);
    await updateDoc(inquiryRef, { status });
  };

  return (
    <SiteContext.Provider value={{
      settings,
      posts,
      inquiries,
      updateSettings,
      addPost,
      updatePost,
      deletePost,
      addInquiry,
      updateInquiryStatus
    }}>
      {children}
    </SiteContext.Provider>
  );
};

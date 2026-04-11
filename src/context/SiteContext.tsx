import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, SiteSettings, ContactInquiry } from '../types';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: "AIzaSyALnxE0MRaudPrQ7CbqGsYKGHTCeuMFrp0",
  authDomain: "boheampago-de893.firebaseapp.com",
  projectId: "boheampago-de893",
  storageBucket: "boheampago-de893.firebasestorage.app",
  messagingSenderId: "330850678315",
  appId: "1:330850678315:web:02f57ae955b74463549c6e",
  measurementId: "G-ZXV0VHFDTR"
};

const canvasAppId = 'boheompago-app';

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

const defaultSettings: SiteSettings = {
  name: '보험파고',
  heroTitle: '분석의 깊이가 보상의 크기를 결정합니다.',
  heroSubtitle: '15년 경력의 보험보상 전문가가 당신의 곁에서 함께합니다.',
  pointColor: '#064E3B', // Deep Forest Green
  fontFamily: 'Pretendard, Noto Sans KR, sans-serif',
  logoUrl: 'https://picsum.photos/seed/logo/200/60',
  kakaoUrl: 'https://open.kakao.com/o/s388apqh', // Placeholder
  instagramUrl: 'https://www.threads.com/@boheampago',
  youtubeUrl: 'https://www.youtube.com/channel/UCelEDbkccWmSDJNW-6jniqA',
  adminPassword: 'admin1234',
};

const initialPosts: Post[] = [
  {
    id: '1',
    title: '5세대실손 관리급여',
    content: '관리급여 관리급여란과잉진료나남용우려가있는비급여의료항목중, 국민의료비부담완화와적정의료이용유도를위해정부가건강보험체계안으로편입시켜진료기준과가격을관리하는제도입니다',
    category: 'analysis',
    date: '2026-03-03',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA0MTFfMjM5/MDAxNzc1ODgzMjM5MDEw.3ldi9rIuLpFld8uHzLwF9TtXeYP0Us0vbR3QsPC5a1Yg.Q3jNvr85lEL2ZSYooWJuZQopMjtEpbFyxGkehUjGkyEg.PNG/c26779b4-7850-4cbc-85a0-4ce64ed4dc9a.png?type=w966',
    externalUrl: 'https://blog.naver.com/xyman1225/224202442112',
  },
  {
    id: '2',
    title: '자궁근종 하이푸(HIFU)시술에 관한 보험사의 보상문제',
    content: '자궁근종은 자궁에서 발생하는 종양 중 가장 흔한 양성 질환으로, 자궁의 대부분을 이루고 있는 평활근에 생깁니다.
      평활근은 자궁 내벽을 구성하는 근육 조직으로, 자궁근종은 이 근육 조직에서 비정상적인 세포의 증식으로 형성됩니다.',
    category: 'compensation',
    date: '2026-04-09',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjA0MDRfMTk5/MDAxNzc1Mjg2NjI0Mjc2.jhKdUMBTiRH-VmxIKXGcF0sCDuCiYETPneFMdGGGFygg.yNq-Sr0yK98h681S1gRJbq_MFUnQunvQsvKL0T9lsm0g.PNG/2026-04-04_16;10;00.PNG?type=w966',
    externalUrl: 'https://blog.naver.com/xyman1225/224246533623',
  },
  {
    id: '3',
    title: '수술비 보험 5세대실손',
    content: '최근 보험 시장에서 가장 많이 이야기되는 변화 중 하나가 바로 5세대 실손의료비입니다. 
      의료 이용이 많을수록 보험료가 크게 올라갈 수 있는 구조로 바뀌면서 많은 분들이 “실손보험만으로 충분할까?”라는 고민을 하게 되었습니다.',
    category: 'analysis',
    date: '2026-03-21',
    imageUrl: 'https://postfiles.pstatic.net/MjAyNjAzMThfMTg4/MDAxNzczODE4MDA0NDAw.PFD2dWolq1c3Nv1siPpJye2uJY0YgiqwOKaLdgf-npkg.tjiLXBlkHG_bkuzDxYUTLrsZlbWgKdD97cEC-NOMbkIg.PNG/2026-03-18_16;03;59.PNG?type=w966',
    externalUrl: 'https://blog.naver.com/xyman1225/224224734797',
  },
];

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

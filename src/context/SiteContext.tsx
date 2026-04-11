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

let finalConfig = firebaseConfig;
let canvasAppId = 'boheompago-app';
try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    finalConfig = JSON.parse(__firebase_config);
  }
  if (typeof __app_id !== 'undefined' && __app_id) {
    canvasAppId = __app_id;
  }
} catch (e) {}
const app = initializeApp(finalConfig);
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
    title: '교통사고 합의금, 절대 먼저 제시하지 마세요',
    content: '교통사고 발생 시 보험사에서 제시하는 합의금은 대개 최소 수준입니다. 전문가의 조언 없이 섣불리 합의하면 정당한 보상을 받지 못할 수 있습니다...',
    category: 'compensation',
    date: '2024-05-10',
    imageUrl: 'https://picsum.photos/seed/car-accident/800/400',
    externalUrl: 'https://blog.naver.com',
  },
  {
    id: '2',
    title: '숨은 보험금 3천만 원 찾아준 사례',
    content: '오래전 가입했던 보험에서 지급되지 않았던 후유장해 보험금을 찾아드린 사례입니다. 고객님께서는 전혀 모르고 계셨던 권리를 되찾아 드렸습니다.',
    category: 'compensation',
    date: '2024-05-08',
    imageUrl: 'https://picsum.photos/seed/money/800/400',
    externalUrl: 'https://blog.naver.com',
  },
  {
    id: '3',
    title: '암 진단비 분쟁, 어떻게 대처해야 할까?',
    content: '보험사에서 암 진단비 지급을 거절하는 경우가 많습니다. 조직검사 결과지 분석을 통해 정당한 암 진단비를 수령한 성공 사례를 소개합니다.',
    category: 'analysis',
    date: '2024-05-05',
    imageUrl: 'https://picsum.photos/seed/hospital/800/400',
    externalUrl: 'https://blog.naver.com',
  },
];

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem('site_settings');
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
      return defaultSettings;
    }
  });
  const [posts, setPosts] = useState<Post[]>(() => {
    try {
      const saved = localStorage.getItem('site_posts');
      const loadedPosts = saved ? JSON.parse(saved) : initialPosts;
      return Array.isArray(loadedPosts) 
        ? loadedPosts.sort((a: Post, b: Post) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : initialPosts;
    } catch (e) {
      console.error('Failed to load posts from localStorage', e);
      return initialPosts;
    }
  });
  const [inquiries, setInquiries] = useState<ContactInquiry[]>(() => {
    try {
      const saved = localStorage.getItem('site_inquiries');
      const loaded = saved ? JSON.parse(saved) : [];
      return Array.isArray(loaded) ? loaded : [];
    } catch (e) {
      console.error('Failed to load inquiries from localStorage', e);
      return [];
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('site_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('site_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('site_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Apply theme color to CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--point-color', settings.pointColor);
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
  }, [settings.pointColor, settings.fontFamily]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addPost = (postData: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      date: postData.date || new Date().toISOString().split('T')[0],
    };
    setPosts(prev => {
      const newList = [newPost, ...prev];
      return newList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const updatePost = (id: string, postData: Partial<Post>) => {
    setPosts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...postData } : p);
      return updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const addInquiry = (inquiryData: Omit<ContactInquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
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

export const useSite = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};

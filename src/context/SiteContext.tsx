import React, { createContext, useContext, useState, useEffect } from 'react';
import { Post, SiteSettings, ContactInquiry } from '../types';

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

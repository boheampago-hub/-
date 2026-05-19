import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post, SiteSettings, ContactInquiry } from '../types';

// 데이터 저장/불러오기 엔드포인트 (Netlify Blobs 함수)
const DATA_ENDPOINT = '/.netlify/functions/site-data';

interface SiteContextType {
  settings: SiteSettings;
  posts: Post[];
  inquiries: ContactInquiry[];
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'success' | 'error';
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
  pointColor: '#064E3B',
  fontFamily: 'Pretendard, Noto Sans KR, sans-serif',
  logoUrl: 'https://picsum.photos/seed/logo/200/60',
  kakaoUrl: 'https://open.kakao.com/o/s388apqh',
  instagramUrl: 'https://www.instagram.com/boheampago?igsh=aW9rMTB3ZTkxc244',
  youtubeUrl: 'https://www.youtube.com/channel/UCelEDbkccWmSDJNW-6jniqA',
  adminPassword: 'admin1234',
};

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings]     = useState<SiteSettings>(defaultSettings);
  const [posts, setPosts]           = useState<Post[]>([]);
  const [inquiries, setInquiries]   = useState<ContactInquiry[]>([]);
  const [isSaving, setIsSaving]     = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [isLoaded, setIsLoaded]     = useState(false);

  // ─── 1. 앱 시작 시 Netlify Blobs에서 데이터 불러오기 ─────────────────────────
  useEffect(() => {
    fetch(DATA_ENDPOINT)
      .then((res) => {
        if (!res.ok) throw new Error('데이터 로드 실패');
        return res.json();
      })
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.posts) {
          setPosts(
            [...data.posts].sort(
              (a: Post, b: Post) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )
          );
        }
        if (data.inquiries) setInquiries(data.inquiries);
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn('데이터 로드 실패, 기본값 사용:', err);
        setIsLoaded(true);
      });
  }, []);

  // ─── 2. CSS 테마 색상 적용 ────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty('--point-color', settings.pointColor);
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
  }, [settings.pointColor, settings.fontFamily]);

  // ─── 3. Netlify Blobs에 저장하는 함수 ────────────────────────────────────────
  const syncToBlobs = useCallback(
    async (
      latestSettings: SiteSettings,
      latestPosts: Post[],
      latestInquiries: ContactInquiry[]
    ) => {
      setIsSaving(true);
      setSaveStatus('saving');

      try {
        const response = await fetch(DATA_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              settings: latestSettings,
              posts: latestPosts,
              inquiries: latestInquiries,
            },
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || '저장 실패');
        }

        setSaveStatus('success');
        console.log('✅ Netlify Blobs 저장 완료 → 즉시 반영!');
      } catch (err) {
        setSaveStatus('error');
        console.error('❌ 저장 오류:', err);
      } finally {
        setIsSaving(false);
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    },
    []
  );

  // ─── 4. 데이터 변경 시 2초 디바운스 후 Blobs에 저장 ──────────────────────────
  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      syncToBlobs(settings, posts, inquiries);
    }, 2000);

    return () => clearTimeout(timer);
  }, [settings, posts, inquiries, isLoaded]);

  // ─── 5. 관리자 기능들 ─────────────────────────────────────────────────────────
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addPost = (postData: Omit<Post, 'id'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      date: postData.date || new Date().toISOString().split('T')[0],
    };
    setPosts((prev) =>
      [newPost, ...prev].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  };

  const updatePost = (id: string, postData: Partial<Post>) => {
    setPosts((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, ...postData } : p))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const addInquiry = (inquiryData: Omit<ContactInquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: ContactInquiry = {
      ...inquiryData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      status: 'new',
    };
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: ContactInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        posts,
        inquiries,
        isSaving,
        saveStatus,
        updateSettings,
        addPost,
        updatePost,
        deletePost,
        addInquiry,
        updateInquiryStatus,
      }}
    >
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

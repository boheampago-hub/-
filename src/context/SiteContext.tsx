import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Post, SiteSettings, ContactInquiry } from '../types';

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
  const [settings, setSettings]   = useState<SiteSettings>(defaultSettings);
  const [posts, setPosts]         = useState<Post[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [isSaving, setIsSaving]   = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // ─── 1. 앱 시작 시 site-data.json 에서 데이터 불러오기 ───────────────────────
  useEffect(() => {
    fetch('/site-data.json')
      .then((res) => {
        if (!res.ok) throw new Error('site-data.json 로드 실패');
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
      })
      .catch((err) => {
        console.warn('site-data.json 로드 실패, 기본값 사용:', err);
      });
  }, []);

  // ─── 2. CSS 테마 색상 적용 ────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.style.setProperty('--point-color', settings.pointColor);
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
  }, [settings.pointColor, settings.fontFamily]);

  // ─── 3. GitHub 동기화 함수 ────────────────────────────────────────────────────
  const syncToGitHub = useCallback(
    async (
      latestSettings: SiteSettings,
      latestPosts: Post[],
      latestInquiries: ContactInquiry[]
    ) => {
      setIsSaving(true);
      setSaveStatus('saving');

      try {
        const response = await fetch('/.netlify/functions/github-sync', {
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
          throw new Error(errData.error || '동기화 실패');
        }

        setSaveStatus('success');
        console.log('✅ GitHub 저장 완료 → Netlify 재배포 시작');
      } catch (err) {
        setSaveStatus('error');
        console.error('❌ GitHub 동기화 오류:', err);
      } finally {
        setIsSaving(false);
        // 3초 후 상태 초기화
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    },
    []
  );

  // ─── 4. 데이터 변경 시 2초 디바운스 후 GitHub에 저장 ─────────────────────────
  //    (초기 로딩 때는 저장하지 않도록 isLoaded 플래그 사용)
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 첫 렌더(기본값 세팅)는 저장 건너뜀
    if (!isLoaded) {
      // posts가 로드되면 isLoaded 활성화
      if (posts.length > 0 || settings.name !== '보험파고') {
        setIsLoaded(true);
      }
      return;
    }

    const timer = setTimeout(() => {
      syncToGitHub(settings, posts, inquiries);
    }, 2000); // 2초 디바운스: 연속 수정 시 마지막 것만 저장

    return () => clearTimeout(timer);
  }, [settings, posts, inquiries]);

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

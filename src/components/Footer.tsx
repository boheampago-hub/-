import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Instagram, Youtube, MessageCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const Footer: React.FC = () => {
  const { settings } = useSite();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const ensureExternalLink = (url?: string) => {
    if (!url || url === '#') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  if (isAdmin) return null;

  return (
    <footer className="bg-gray-900 text-white py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold tracking-tight">{settings.name}</span>
          </Link>
          <p className="text-gray-400 max-w-md leading-relaxed mb-8">
            보험파고는 고객의 정당한 권리를 지키기 위해 최선을 다합니다. 
            15년 이상의 실무 경험과 전문 지식을 바탕으로 최적의 보상 솔루션을 제공합니다.
          </p>
          <div className="flex gap-4">
            <a 
              href={ensureExternalLink(settings.kakaoUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle size={20} />
            </a>
            <a 
              href={ensureExternalLink(settings.instagramUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a 
              href={ensureExternalLink(settings.youtubeUrl)} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"
            >
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">바로가기</h4>
          <ul className="space-y-4 text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">전문가 소개</Link></li>
            <li><Link to="/cases" className="hover:text-white transition-colors">칼럼</Link></li>
            <li><Link to="/cases" className="hover:text-white transition-colors">블로그</Link></li>
            <li><a href={ensureExternalLink(settings.kakaoUrl)} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">무료카톡상담</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">고객센터</h4>
          <ul className="space-y-4 text-gray-400">
            <li>대표번호: 010-8144-2942</li>
            <li>이메일: xyman1225@naver.com</li>
            <li>상담시간: 평일 09:00 - 18:00</li>
            <li>주말 및 공휴일 휴무</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2024 {settings.name}. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/admin" className="hover:text-gray-300">관리자 로그인</Link>
          <a href="#" className="hover:text-gray-300">개인정보처리방침</a>
          <a href="#" className="hover:text-gray-300">이용약관</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

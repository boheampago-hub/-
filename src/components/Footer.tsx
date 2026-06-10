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
            <li>상담시간: 24시간 항시가능 </li>
            <li>주말 및 공휴일 가능</li>
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

      {/* 💡 [보험파고 추가 문구 영역] 이 자리에 넣고 싶으신 보험파고 관련 문구를 입력하시면 됩니다. */}
        <div className="w-full text-center md:text-left text-gray-400 border-t border-gray-800/60 pt-4 mt-2 text-xs md:text-sm leading-relaxed">
          <p>
             (주)글로벌 금융 판매 대리점 등록번호 제 2009091278 호 보험설계사 박철호 (생명,손해보험협회 등록번호 제20130574120019호) (주)글로벌금융판매 준법감시인 심의필 제 26-05-1489호 (2026-05-212027-05-20) *본 광고는 광고심의기준을 준수하였으며, 유효기간은 심의일로부터 1년입니다. 금융상품판매 대리*중개 업무 관련 안내 (주)글로벌금융판매 박철호 은(는) 다수의 보험회사의 보험모집위탁계약을 체결한 법인보험대리점 소속 보험설계사입니다. 박철호 은(는) 직접 보험계약을 체결하거나 보험회사를 대리하여 보험계약의 승낙 , 변경 등 의사표시를 할 수 있는 권한 , 보험료영수권을 가지지 아니하며 보험계약의 체결 인수여부 심사 및 결정 권한은 보험회사에 있습니다. 모집종사자 개인 의견 안내 상기 내용은 (주)글로벌금융판매 박철호 의 개인의견이며, 계약 체결에 따른 이익 또는 손실은 보험 계약자 등에게 귀속됩니다. 승환계약 관련 유의 안내 보험계약자가 기존 보험계약을 해지하고 새로운 보험계약을 체결하는 과정에서 ①질병이력, 연령증가 등으로 가입이 거절 되거나 보험료가 인상될 수 있습니다. ②가입 상품에 따라 새로운 면책기간 적용 및 보장 제한 등 기타 불이익이 발생할 수 있습니다.
          </p>
        </div>
    </footer>
  );
};

export default Footer;

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, MessageCircle, Instagram, Youtube, CheckCircle } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const Contact: React.FC = () => {
  const { settings, addInquiry } = useSite();
  const [submitted, setSubmitted] = useState(false);

  const ensureExternalLink = (url?: string) => {
    if (!url || url === '#') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send to Formspree using FormData for better compatibility
      const formBody = new FormData();
      formBody.append('name', formData.name);
      formBody.append('phone', formData.phone);
      formBody.append('message', formData.message);

      const response = await fetch('https://formspree.io/f/xkopajqy', {
        method: 'POST',
        body: formBody,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Also add to local context for admin dashboard
        addInquiry(formData);
        setSubmitted(true);
        setFormData({ name: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        alert('상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('네트워크 오류가 발생했습니다. 연결 상태를 확인해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div>
              <span className="text-[var(--point-color)] font-bold tracking-widest uppercase text-sm mb-4 block">
                CONTACT US
              </span>
              <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-8">
                당신의 권리를<br />
                <span className="text-[var(--point-color)]">되찾아 드립니다.</span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                상담은 무료이며, 모든 내용은 철저히 비밀이 보장됩니다. 
                부담 없이 문의해 주세요.
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[var(--point-color)] flex items-center justify-center shrink-0">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">대표 번호</h4>
                  <p className="text-2xl font-bold text-gray-700">010-8144-2942</p>
                  <p className="text-sm text-gray-500 mt-1">평일 09:00 - 18:00 (주말/공휴일 휴무)</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">이메일 문의</h4>
                  <p className="text-xl font-bold text-gray-700">xyman1225@naver.com</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1">사무실 위치</h4>
                  <p className="text-xl font-bold text-gray-700">인천광역시 부평구 부평대로 55, 국천빌딩 11층</p>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-gray-100">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">SNS 채널</h4>
              <div className="flex gap-6">
                <a 
                  href={ensureExternalLink(settings.kakaoUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors font-bold"
                >
                  <MessageCircle size={24} /> 카카오톡
                </a>
                <a 
                  href={ensureExternalLink(settings.instagramUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors font-bold"
                >
                  <Instagram size={24} /> 인스타그램
                </a>
                <a 
                  href={ensureExternalLink(settings.youtubeUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-bold"
                >
                  <Youtube size={24} /> 유튜브
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-2xl shadow-gray-200/50 border border-gray-100 relative z-10">
              <h3 className="text-3xl font-bold text-gray-900 mb-10">무료 상담 신청</h3>
              
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-20 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">신청이 완료되었습니다!</h4>
                  <p className="text-gray-600">확인 후 빠른 시일 내에 연락드리겠습니다.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">성함</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                      placeholder="성함을 입력해 주세요"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">연락처</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                      placeholder="010-0000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">상담 내용</label>
                    <textarea 
                      rows={5}
                      name="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" 
                      placeholder="사고 경위나 궁금하신 내용을 간단히 적어주세요"
                    ></textarea>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className={`w-full btn-primary py-5 text-lg font-bold shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3 transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          신청 중...
                        </>
                      ) : (
                        <>
                          상담 신청하기 <Send size={20} />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-6">
                      본 신청을 통해 수집된 개인정보는 상담 목적으로만 사용되며,<br />
                      개인정보처리방침에 따라 안전하게 관리됩니다.
                    </p>
                  </div>
                </form>
              )}
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full -z-10 blur-2xl opacity-60"></div>
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-50 rounded-full -z-10 blur-3xl opacity-60"></div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

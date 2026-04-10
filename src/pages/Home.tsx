import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Award, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';

const Home: React.FC = () => {
  const { settings, posts } = useSite();

  const ensureExternalLink = (url?: string) => {
    if (!url || url === '#') return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white to-white"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-[var(--point-color)] text-sm font-bold mb-6 tracking-wider">
              보험보상 전문가 그룹
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-8 tracking-tight">
              <span className="text-[var(--point-color)]">분석의 깊이가</span><br />
              보상의 크기를<br />
              결정합니다.
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-xl">
              {settings.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href={ensureExternalLink(settings.kakaoUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-primary flex items-center justify-center gap-2 text-lg"
              >
                무료카톡상담하기 <ArrowRight size={20} />
              </a>
              <Link to="/about" className="px-8 py-3 rounded-full border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-all text-center">
                전문가 소개 보기
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000" 
                alt="Expert" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">15년+</p>
                  <p className="text-sm text-gray-500">보험 실무 경력</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">2,530건+</p>
                  <p className="text-sm text-gray-500">누적 상담 사례</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">왜 보험파고인가?</h2>
            <p className="text-gray-600">보험사의 일방적인 주장에 맞서 당신의 권리를 지켜드립니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: '전문성', desc: '15년 경력의 보험사 출신 전문가가 직접 분석합니다.', icon: <Award className="w-8 h-8" /> },
              { title: '투명성', desc: '모든 진행 과정을 투명하게 공개하고 소통합니다.', icon: <CheckCircle2 className="w-8 h-8" /> },
              { title: '결과 중심', desc: '최선의 보상 결과를 위해 끝까지 포기하지 않습니다.', icon: <Users className="w-8 h-8" /> },
            ].map((item, i) => (
              <div key={i} className="lux-card p-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[var(--point-color)] flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Cases Preview */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">보상및사례</h2>
              <p className="text-gray-600">보험파고가 전하는 유익한 보험 정보와 보상 사례입니다.</p>
            </div>
            <Link to="/cases" className="text-[var(--point-color)] font-bold flex items-center gap-1 hover:underline">
              전체보기 <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => {
              const isExternal = !!post.externalUrl;
              const LinkComponent = isExternal ? 'a' : Link;
              const linkProps = isExternal 
                ? { href: post.externalUrl, target: "_blank", rel: "noopener noreferrer" } 
                : { to: `/cases/${post.id}` };

              return (
                <LinkComponent key={post.id} {...(linkProps as any)} className="group">
                  <div className="lux-card overflow-hidden h-full flex flex-col">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-8 flex-grow">
                      <span className="text-xs font-bold text-[var(--point-color)] uppercase tracking-widest mb-3 block">
                        {post.category === 'product' ? '상품' : 
                         post.category === 'compensation' ? '보상및사례' : 
                         '약관분석'}
                      </span>
                      <h3 className="text-xl font-bold mb-4 group-hover:text-[var(--point-color)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                        {post.content}
                      </p>
                      <div className="text-gray-400 text-xs">{post.date}</div>
                    </div>
                  </div>
                </LinkComponent>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[var(--point-color)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
            지금 바로 당신의 숨은 권리를 확인하세요
          </h2>
          <p className="text-emerald-100 text-lg mb-12 opacity-80">
            상담은 무료이며, 보상 가능 여부를 즉시 진단해 드립니다.
          </p>
          <a 
            href={ensureExternalLink(settings.kakaoUrl)} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="bg-white text-[var(--point-color)] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all inline-flex items-center gap-2 shadow-xl"
          >
            무료카톡상담하기 <BookOpen size={20} />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;

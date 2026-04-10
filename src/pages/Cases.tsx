import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, ArrowRight, Calendar, Tag } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { Link } from 'react-router-dom';

const Cases: React.FC = () => {
  const { posts } = useSite();
  const [filter, setFilter] = useState<'all' | 'product' | 'compensation' | 'analysis'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesFilter = filter === 'all' || post.category === filter;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-20">
      {/* Header */}
      <section className="section-padding bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-8"
          >
            보상및사례
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            보험파고가 전하는 유익한 보험 정보와 블로그 소식을 공유합니다.
          </motion.p>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto">
            {[
              { id: 'all', label: '전체' },
              { id: 'product', label: '상품' },
              { id: 'compensation', label: '보상및사례' },
              { id: 'analysis', label: '약관분석' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id as any)}
                className={`flex-grow md:flex-none px-8 py-3 rounded-xl font-bold text-sm transition-all ${filter === item.id ? 'bg-white text-[var(--point-color)] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
            />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-6 md:px-12 lg:px-24 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-40 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <Filter className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {(() => {
                    const isExternal = !!post.externalUrl;
                    const LinkComponent = isExternal ? 'a' : Link;
                    const linkProps = isExternal 
                      ? { href: post.externalUrl, target: "_blank", rel: "noopener noreferrer" } 
                      : { to: `/cases/${post.id}` };

                    return (
                      <LinkComponent {...(linkProps as any)} className="group block h-full">
                        <div className="lux-card overflow-hidden h-full flex flex-col">
                          <div className="aspect-[16/10] overflow-hidden relative">
                            <img 
                              src={post.imageUrl || 'https://picsum.photos/seed/placeholder/800/500'} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-4 left-4">
                              <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                                post.category === 'product' ? 'bg-emerald-600 text-white' : 
                                post.category === 'compensation' ? 'bg-blue-600 text-white' : 
                                'bg-purple-600 text-white'
                              }`}>
                                {post.category === 'product' ? '상품' : 
                                 post.category === 'compensation' ? '보상및사례' : 
                                 '약관분석'}
                              </span>
                            </div>
                          </div>
                          <div className="p-10 flex-grow flex flex-col">
                            <div className="flex items-center gap-4 text-gray-400 text-xs mb-6">
                              <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                              <span className="flex items-center gap-1.5"><Tag size={14} /> {
                                post.category === 'product' ? '상품' : 
                                post.category === 'compensation' ? '보상및사례' : 
                                '약관분석'
                              }</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-6 group-hover:text-[var(--point-color)] transition-colors leading-snug line-clamp-2">
                              {post.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed line-clamp-3 mb-8 flex-grow">
                              {post.content}
                            </p>
                            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                              <span className="text-sm font-bold text-gray-900 group-hover:text-[var(--point-color)] transition-colors">자세히 보기</span>
                              <ArrowRight size={18} className="text-gray-300 group-hover:text-[var(--point-color)] group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </div>
                      </LinkComponent>
                    );
                  })()}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cases;

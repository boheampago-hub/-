import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Image as ImageIcon,
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { Post, SiteSettings, ContactInquiry } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const Admin: React.FC = () => {
  const { settings, posts, inquiries, updateSettings, addPost, updatePost, deletePost, updateInquiryStatus } = useSite();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'settings' | 'inquiries'>('dashboard');
  const [isEditingPost, setIsEditingPost] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<Omit<Post, 'id'>>({ 
    title: '', 
    content: '', 
    category: 'product', 
    imageUrl: '', 
    externalUrl: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('admin_logged_in') === 'true');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use password from settings (persisted in localStorage via SiteContext)
    const adminPassword = settings.adminPassword || 'admin1234';
    
    if (password.trim() === adminPassword) {
      setIsLoggedIn(true);
      localStorage.setItem('admin_logged_in', 'true');
      setError('');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Settings size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">관리자 로그인</h1>
            <p className="text-gray-500 mt-2">관리 페이지 접속을 위해 비밀번호를 입력하세요.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">비밀번호</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all pr-12"
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
            <button 
              type="submit" 
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all"
            >
              로그인
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">홈으로 돌아가기</a>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updates: Partial<SiteSettings> = {
      name: formData.get('name') as string,
      heroTitle: formData.get('heroTitle') as string,
      heroSubtitle: formData.get('heroSubtitle') as string,
      pointColor: formData.get('pointColor') as string,
      kakaoUrl: formData.get('kakaoUrl') as string,
      instagramUrl: formData.get('instagramUrl') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
      adminPassword: formData.get('adminPassword') as string,
    };
    updateSettings(updates);
    alert('설정이 저장되었습니다.');
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingPost) {
      updatePost(isEditingPost, newPost);
      setIsEditingPost(null);
    } else {
      addPost(newPost);
    }
    setNewPost({ 
      title: '', 
      content: '', 
      category: 'product', 
      imageUrl: '', 
      externalUrl: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDeletePost = (id: string) => {
    deletePost(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-30">
        <div className="p-8 border-b border-gray-800">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="text-emerald-400" /> 보험파고 Admin
          </h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          {[
            { id: 'dashboard', label: '대시보드', icon: <LayoutDashboard size={20} /> },
            { id: 'posts', label: '게시글 관리', icon: <FileText size={20} /> },
            { id: 'inquiries', label: '상담 문의', icon: <MessageSquare size={20} /> },
            { id: 'settings', label: '사이트 설정', icon: <Settings size={20} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">
            {activeTab === 'dashboard' && '대시보드'}
            {activeTab === 'posts' && '게시글 관리'}
            {activeTab === 'inquiries' && '상담 문의 확인'}
            {activeTab === 'settings' && '사이트 설정'}
          </h2>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              사이트 바로가기 <ExternalLink size={14} />
            </a>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
              AD
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-2">누적 상담 문의</p>
                <p className="text-4xl font-bold text-gray-900">{inquiries.length}건</p>
                <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
                  <Plus size={14} /> 이번 주 +5건
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-2">작성된 게시글</p>
                <p className="text-4xl font-bold text-gray-900">{posts.length}개</p>
                <div className="mt-4 flex flex-wrap gap-2 text-blue-600 text-sm font-medium">
                  <FileText size={14} /> 상품 {posts.filter(p => p.category === 'product').length} / 보상및사례 {posts.filter(p => p.category === 'compensation').length} / 약관분석 {posts.filter(p => p.category === 'analysis').length}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-sm mb-2">미확인 문의</p>
                <p className="text-4xl font-bold text-emerald-600">{inquiries.filter(i => i.status === 'new').length}건</p>
                <div className="mt-4 flex items-center gap-2 text-red-500 text-sm font-medium">
                  <Clock size={14} /> 빠른 확인이 필요합니다
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'posts' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-bold text-gray-900">새 게시글 작성</h3>
                </div>
                <form onSubmit={handleAddPost} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">제목</label>
                        <input 
                          type="text" 
                          value={newPost.title}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" 
                          placeholder="제목을 입력하세요"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">카테고리</label>
                        <select 
                          value={newPost.category}
                          onChange={(e) => setNewPost({...newPost, category: e.target.value as any})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          <option value="product">상품</option>
                          <option value="compensation">보상및사례</option>
                          <option value="analysis">약관분석</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">작성일</label>
                        <input 
                          type="date" 
                          value={newPost.date}
                          onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" 
                          required
                        />
                      </div>
                    </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">블로그 연결 URL (외부 링크)</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={newPost.externalUrl || ''}
                        onChange={(e) => setNewPost({...newPost, externalUrl: e.target.value})}
                        className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        placeholder="https://blog.naver.com/..."
                      />
                      <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-400">
                        <ExternalLink size={20} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">URL을 입력하면 게시글 클릭 시 해당 블로그로 이동합니다.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">대표 이미지 URL</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={newPost.imageUrl}
                        onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                        className="flex-grow px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" 
                        placeholder="https://images.unsplash.com/..."
                      />
                      <button type="button" className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200">
                        <ImageIcon size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">내용</label>
                    <textarea 
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" 
                      placeholder="내용을 입력하세요"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-4">
                    {isEditingPost && (
                      <button 
                        type="button" 
                        onClick={() => { 
                          setIsEditingPost(null); 
                          setNewPost({ 
                            title: '', 
                            content: '', 
                            category: 'product', 
                            imageUrl: '', 
                            externalUrl: '',
                            date: new Date().toISOString().split('T')[0]
                          }); 
                        }}
                        className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                      >
                        취소
                      </button>
                    )}
                    <button type="submit" className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                      <Save size={18} /> {isEditingPost ? '수정 완료' : '게시글 저장'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-4 font-bold text-gray-700 text-sm">제목</th>
                      <th className="px-8 py-4 font-bold text-gray-700 text-sm">카테고리</th>
                      <th className="px-8 py-4 font-bold text-gray-700 text-sm">작성일</th>
                      <th className="px-8 py-4 font-bold text-gray-700 text-sm text-right">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-6 font-medium text-gray-900">{post.title}</td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            post.category === 'product' ? 'bg-emerald-100 text-emerald-700' : 
                            post.category === 'compensation' ? 'bg-blue-100 text-blue-700' : 
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {post.category === 'product' ? '상품' : 
                             post.category === 'compensation' ? '보상및사례' : 
                             '약관분석'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-gray-500 text-sm">{post.date}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setIsEditingPost(post.id); setNewPost({ title: post.title, content: post.content, category: post.category, imageUrl: post.imageUrl || '', externalUrl: post.externalUrl || '', date: post.date }); }}
                              className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <div className="relative">
                              <button 
                                onClick={() => setDeleteConfirmId(deleteConfirmId === post.id ? null : post.id)}
                                className={`p-2 rounded-lg transition-all ${deleteConfirmId === post.id ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                              >
                                <Trash2 size={18} />
                              </button>
                              <AnimatePresence>
                                {deleteConfirmId === post.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50"
                                  >
                                    <p className="text-xs font-bold text-gray-900 mb-3 text-center">정말 삭제하시겠습니까?</p>
                                    <div className="flex gap-2">
                                      <button 
                                        onClick={() => handleDeletePost(post.id)}
                                        className="flex-grow py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700"
                                      >
                                        삭제
                                      </button>
                                      <button 
                                        onClick={() => setDeleteConfirmId(null)}
                                        className="flex-grow py-2 bg-gray-100 text-gray-600 text-xs font-bold rounded-lg hover:bg-gray-200"
                                      >
                                        취소
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'inquiries' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              {inquiries.length === 0 ? (
                <div className="bg-white p-20 rounded-2xl shadow-sm border border-gray-100 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">아직 접수된 문의가 없습니다.</p>
                </div>
              ) : (
                inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center gap-3">
                        <h4 className="text-xl font-bold text-gray-900">{inquiry.name}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${inquiry.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {inquiry.status === 'new' ? '신규 문의' : '확인 완료'}
                        </span>
                        <span className="text-gray-400 text-sm">{inquiry.date}</span>
                      </div>
                      <p className="text-gray-700 font-medium">연락처: {inquiry.phone}</p>
                      <div className="bg-gray-50 p-6 rounded-xl text-gray-600 leading-relaxed">
                        {inquiry.message}
                      </div>
                    </div>
                    <div className="flex md:flex-col justify-end gap-3">
                      {inquiry.status === 'new' && (
                        <button 
                          onClick={() => updateInquiryStatus(inquiry.id, 'read')}
                          className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                          <CheckCircle size={18} /> 확인 처리
                        </button>
                      )}
                      <button className="px-6 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">
                        답변하기
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSaveSettings} className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 border-b pb-4">기본 정보</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">사이트 이름</label>
                        <input name="name" type="text" defaultValue={settings.name} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">포인트 컬러</label>
                        <div className="flex gap-4">
                          <input name="pointColor" type="color" defaultValue={settings.pointColor} className="w-14 h-14 rounded-xl border-none outline-none cursor-pointer" />
                          <input type="text" value={settings.pointColor} readOnly className="flex-grow px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">카카오톡 오픈프로필 URL</label>
                        <input name="kakaoUrl" type="text" defaultValue={settings.kakaoUrl} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://open.kakao.com/o/..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">인스타그램 URL</label>
                        <input name="instagramUrl" type="text" defaultValue={settings.instagramUrl} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://instagram.com/..." />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">유튜브 URL</label>
                        <input name="youtubeUrl" type="text" defaultValue={settings.youtubeUrl} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="https://youtube.com/..." />
                      </div>
                      <div className="space-y-2 pt-4">
                        <h3 className="text-lg font-bold text-gray-900 border-b pb-4">관리자 보안</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">새 비밀번호</label>
                            <div className="relative">
                              <input 
                                name="adminPassword" 
                                type={showPassword ? "text" : "password"} 
                                defaultValue={settings.adminPassword} 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none pr-12" 
                              />
                              <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-gray-400">비밀번호를 변경하면 다음 로그인부터 적용됩니다. 눈 아이콘을 클릭하여 입력한 비밀번호를 확인할 수 있습니다.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-lg font-bold text-gray-900 border-b pb-4">메인 히어로 섹션</h3>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">메인 헤드라인</label>
                        <input name="heroTitle" type="text" defaultValue={settings.heroTitle} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">서브 헤드라인</label>
                        <textarea name="heroSubtitle" rows={3} defaultValue={settings.heroSubtitle} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end pt-6 border-t">
                    <button type="submit" className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transition-all flex items-center gap-2">
                      <Save size={20} /> 설정 저장하기
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Admin;

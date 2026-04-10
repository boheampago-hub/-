import React from 'react';
import { motion } from 'motion/react';
import { Award, CheckCircle2, Search, Briefcase, GraduationCap } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const About: React.FC = () => {
  const { settings } = useSite();

  return (
    <div className="pt-32 pb-20">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&q=80&w=1000" 
                alt="Expert Portrait" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-50 rounded-full -z-10 blur-3xl opacity-50"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <span className="text-[var(--point-color)] font-bold tracking-widest uppercase text-sm mb-4 block">
                ABOUT {settings.name}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                고객의 권리를 위해<br />
                <span className="text-[var(--point-color)]">15년을 달려왔습니다.</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                보험사는 거대하고 전문적입니다. 하지만 고객은 혼자입니다. 
                보험파고는 그 불균형을 해소하고 고객이 마땅히 받아야 할 권리를 
                되찾아드리기 위해 존재합니다.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[var(--point-color)] flex items-center justify-center shrink-0">
                  <Briefcase size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">주요 약력</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• 前 삼성화재 보상팀 5년 근무</li>
                    <li>• 現 5년연속 우수인증설계사</li>
                    <li>• 現 글로벌금융판매 10년근속 본부장</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">자격 및 활동</h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• 손해보험, 생명보험 자격 보유</li>
                    <li>• 한국손해보험협회 정회원</li>
                    <li>• 다수 기업 및 공공기관 보험 보상 자문 위원</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <blockquote className="border-l-4 border-[var(--point-color)] pl-6 italic text-gray-700 text-xl font-medium">
                "보상은 단순히 돈의 문제가 아닙니다. 억울함을 풀고 일상을 회복하는 과정입니다."
              </blockquote>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">보험파고의 3대 철학</h2>
            <p className="text-gray-600">우리는 단순한 대행자가 아닌, 당신의 가장 든든한 파트너가 되겠습니다.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: '철저한 분석', desc: '의학적, 법률적 근거를 바탕으로 보험사의 논리를 정면으로 반박합니다.', icon: <Search className="w-10 h-10" /> },
              { title: '정직한 상담', desc: '가능성이 없는 사건은 솔직하게 말씀드립니다. 수임만을 위한 희망고문은 하지 않습니다.', icon: <CheckCircle2 className="w-10 h-10" /> },
              { title: '끝까지 동행', desc: '최종 보상금이 입금되는 순간까지 모든 과정을 책임지고 함께합니다.', icon: <Award className="w-10 h-10" /> },
            ].map((item, i) => (
              <div key={i} className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 group">
                <div className="w-20 h-20 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-emerald-50 group-hover:text-[var(--point-color)] flex items-center justify-center mb-8 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

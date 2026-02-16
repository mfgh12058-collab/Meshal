
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AchievementCard from './components/AchievementCard';
import SkillBar from './components/SkillBar';
import MeshaalGame from './components/MeshaalGame';
import MeshaalQuiz from './components/MeshaalQuiz';
import { Achievement, Skill, StudentProfile } from './types';
import { improveBio } from './services/geminiService';
import { Icons } from './constants';

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isImprovingBio, setIsImprovingBio] = useState(false);

  // Initial Data
  const defaultProfile: StudentProfile = {
    name: "مشعل فواز الغامدي",
    grade: "الصف السابع",
    school: "مدرسة الأندلس الأهلية",
    bio: "طالب طموح في مدرسة الأندلس، أسعى للتميز الدراسي والمشاركة الفعالة في الأنشطة المدرسية. أهتم بالتقنية والابتكار وأطمح لترك بصمة إيجابية في مجتمعي التعليمي.",
    avatar: "https://picsum.photos/seed/meshaal/400/400",
    email: "meshaal.f@example.edu",
    hobbies: ["التايكوندو", "كرة القدم", "السباحة"]
  };

  const defaultAchievements: Achievement[] = [
    {
      id: 'taekwondo-2025',
      title: "المركز الأول في بطولة التايكوندو",
      category: 'sport',
      date: "2025",
      description: "الحصول على الميدالية الذهبية والمركز الأول في بطولة التايكوندو السنوية، مبرزاً القوة والانضباط والروح الرياضية العالية.",
      image: "https://images.unsplash.com/photo-1552072092-7f9b8d63efcb?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: 'award-2025-sahel',
      title: "وسام التميز الدراسي (المركز الثاني)",
      category: 'academic',
      date: "2025",
      description: "الحصول على المركز الثاني في قائمة المتفوقين بمدرسة الساحل للمرحلة الابتدائية - الصف السادس، تقديراً للاجتهاد والمثابرة العلمية.",
      image: "https://images.unsplash.com/photo-1523240715630-9918c13d190c?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: '0',
      title: "بطل دوري المدارس 2025",
      category: 'sport',
      date: "2025",
      description: "تحقيق المركز الأول في بطولة دوري المدارس المرموقة، وقيادة فريق مدرسة الساحل الأهلية لمنصة التتويج بجدارة.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800"
    }
  ];

  const defaultSkills: Skill[] = [
    { name: "مهارات التايكوندو", level: 90, category: "Sports" },
    { name: "مهارات كرة القدم", level: 95, category: "Sports" },
    { name: "الإلقاء والخطابة", level: 85, category: "Soft Skills" },
    { name: "العمل الجماعي والقيادة", level: 90, category: "Soft Skills" },
  ];

  // State with LocalStorage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('student_profile');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.hobbies || parsed.hobbies.length < 3) {
            return { ...parsed, hobbies: defaultProfile.hobbies };
        }
        return parsed;
    }
    return defaultProfile;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('student_achievements');
    if (saved) {
      const parsed = JSON.parse(saved);
      // تحديث البيانات القديمة في LocalStorage إذا كانت موجودة لتعكس التعديل الجديد
      const updated = parsed.map((a: Achievement) => {
        if (a.id === '0') {
          return {
            ...a,
            description: "تحقيق المركز الأول في بطولة دوري المدارس المرموقة، وقيادة فريق مدرسة الساحل الأهلية لمنصة التتويج بجدارة."
          };
        }
        return {
          ...a,
          image: a.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
        };
      });
      return updated.filter((a: Achievement) => a.id !== '1');
    }
    return defaultAchievements;
  });

  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('student_skills');
    return saved ? JSON.parse(saved) : defaultSkills;
  });

  useEffect(() => {
    localStorage.setItem('student_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('student_achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('student_skills', JSON.stringify(skills));
  }, [skills]);

  const handleImproveBio = async () => {
    setIsImprovingBio(true);
    const newBio = await improveBio(profile.bio);
    setProfile({ ...profile, bio: newBio });
    setIsImprovingBio(false);
  };

  const addAchievement = () => {
    const newAch: Achievement = {
      id: Date.now().toString(),
      title: "إنجاز جديد رائع",
      category: 'academic',
      date: "2025",
      description: "وصف مفصل للإنجاز الجديد الذي تم تحقيقه مؤخراً...",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"
    };
    setAchievements([newAch, ...achievements]);
  };

  const deleteAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setAchievements(achievements.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const addSkill = () => {
    const newSkill: Skill = { name: "مهارة جديدة", level: 50, category: "Soft Skills" };
    setSkills([...skills, newSkill]);
  };

  const deleteSkill = (name: string) => {
    setSkills(skills.filter(s => s.name !== name));
  };

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-right">
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />

      {/* Admin Toggle Button */}
      <div className="fixed bottom-6 left-6 z-[60]">
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-2xl transition-all transform hover:scale-105 ${isAdmin ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}`}
        >
          {isAdmin ? 'إغلاق لوحة التحكم ✖' : 'فتح لوحة التحكم ⚙️'}
        </button>
      </div>

      {isAdmin && (
        <div className="fixed inset-0 z-[55] bg-white/95 backdrop-blur-xl overflow-y-auto p-6 md:p-12 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto pb-32">
            <h2 className="text-4xl font-black mb-12 text-gray-900 border-b pb-6 text-right">لوحة تحكم مشعل 🚀</h2>
            
            {/* Profile Section */}
            <div className="mb-16 bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2 text-right">البيانات الأساسية <span className="text-sm font-normal text-gray-400">(يتم الحفظ تلقائياً)</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                <div>
                  <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                  <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">المدرسة الحالية</label>
                  <input value={profile.school} onChange={e => setProfile({...profile, school: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">الصف الدراسي</label>
                  <input value={profile.grade} onChange={e => setProfile({...profile, grade: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">رابط الصورة الشخصية</label>
                  <input value={profile.avatar} onChange={e => setProfile({...profile, avatar: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">النبذة التعريفية</label>
                  <textarea value={profile.bio} rows={4} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200 text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                  <button onClick={handleImproveBio} disabled={isImprovingBio} className="mt-2 text-sky-600 font-bold hover:underline">
                    {isImprovingBio ? 'جاري تحسين النص...' : '✨ تحسين النبذة بالذكاء الاصطناعي'}
                  </button>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mb-16 text-right">
              <div className="flex justify-between items-center mb-6 flex-row-reverse">
                <h3 className="text-2xl font-bold">إدارة الإنجازات</h3>
                <button onClick={addAchievement} className="bg-sky-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-200 hover:bg-sky-600 transition-all">+ إضافة إنجاز جديد</button>
              </div>
              <div className="space-y-6">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-8 bg-white border border-gray-200 rounded-[2rem] shadow-sm text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-400 mb-1">رابط صورة الإنجاز (ضروري)</label>
                        <input value={ach.image || ''} onChange={e => updateAchievement(ach.id, 'image', e.target.value)} placeholder="ضع رابط الصورة هنا..." className="w-full p-4 border rounded-xl text-right bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">عنوان الإنجاز</label>
                        <input value={ach.title} onChange={e => updateAchievement(ach.id, 'title', e.target.value)} placeholder="عنوان الإنجاز" className="w-full p-4 border rounded-xl text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">التاريخ</label>
                        <input value={ach.date} onChange={e => updateAchievement(ach.id, 'date', e.target.value)} placeholder="التاريخ" className="w-full p-4 border rounded-xl text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-1">الفئة</label>
                        <select value={ach.category} onChange={e => updateAchievement(ach.id, 'category', e.target.value as any)} className="w-full p-4 border rounded-xl text-right focus:ring-2 focus:ring-sky-500 outline-none">
                          <option value="academic">أكاديمي</option>
                          <option value="sport">رياضي</option>
                          <option value="art">فني</option>
                          <option value="voluntary">تطوعي</option>
                        </select>
                      </div>
                    </div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">الوصف</label>
                    <textarea value={ach.description} onChange={e => updateAchievement(ach.id, 'description', e.target.value)} placeholder="وصف الإنجاز" className="w-full p-4 border rounded-xl mb-4 text-right focus:ring-2 focus:ring-sky-500 outline-none" />
                    <button onClick={() => deleteAchievement(ach.id)} className="bg-red-50 text-red-500 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">حذف الإنجاز</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div className="text-right">
              <div className="flex justify-between items-center mb-6 flex-row-reverse">
                <h3 className="text-2xl font-bold">إدارة المهارات</h3>
                <button onClick={addSkill} className="bg-sky-500 text-white px-4 py-2 rounded-lg font-bold">+ إضافة مهارة</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-4 flex-row-reverse">
                    <input value={skill.name} onChange={e => updateSkill(index, 'name', e.target.value)} className="flex-1 p-2 border rounded text-right" />
                    <input type="number" value={skill.level} onChange={e => updateSkill(index, 'level', parseInt(e.target.value))} className="w-20 p-2 border rounded text-center" />
                    <button onClick={() => deleteSkill(skill.name)} className="text-red-500 text-xl font-bold">&times;</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main View Mode */}
      {!isAdmin && (
        <>
          {/* Hero Section */}
          <section id="home" className="pt-40 pb-20 px-6 gradient-bg relative overflow-hidden scroll-mt-24">
            <div className="absolute top-20 left-20 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl animate-pulse delay-700"></div>
            
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
              <div className="flex-1 text-center md:text-right">
                <div className="inline-block px-4 py-2 bg-sky-100 text-sky-600 rounded-2xl font-bold mb-6 animate-bounce">
                  مرحباً بكم في عالمي الرقمي 👋
                </div>
                <h1 className="text-6xl md:text-7xl font-black text-gray-900 mb-8 leading-tight">
                   {profile.name} <br />
                  <span className="text-sky-600 font-bold text-3xl md:text-4xl">{profile.grade} 🎓 {profile.school}</span>
                </h1>
                <p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed font-medium">
                  {profile.bio}
                </p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <a href="#achievements" className="bg-sky-500 text-white px-10 py-4 rounded-[1.5rem] font-black text-lg hover:bg-sky-600 transition-all shadow-xl shadow-sky-200 transform hover:scale-105">
                    استكشف إنجازاتي 🚀
                  </a>
                  <a href="#contact" className="bg-white text-gray-900 px-10 py-4 rounded-[1.5rem] font-black text-lg hover:bg-gray-50 transition-all border-2 border-gray-100 shadow-lg transform hover:scale-105">
                    تواصل معي 📩
                  </a>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -inset-6 bg-gradient-to-tr from-sky-500 to-indigo-500 rounded-[4rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative">
                  <img 
                    src={profile.avatar} 
                    alt={profile.name}
                    className="relative w-72 h-72 md:w-96 md:h-96 object-cover rounded-[4rem] shadow-2xl border-[12px] border-white transform transition-transform group-hover:rotate-2"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 animate-bounce">
                    <span className="text-4xl">🏆</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section id="achievements" className="py-24 px-6 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">معرض الإنجازات</h2>
                <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">لحظات من الفخر والتميز في رحلتي التعليمية والرياضية</p>
                <div className="w-24 h-2 bg-sky-500 mx-auto rounded-full mt-8"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </section>

          {/* Challenges Section (Game & Quiz) */}
          <section id="game" className="py-24 px-6 bg-gray-50 scroll-mt-24">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">تحديات مشعل 🎮</h2>
                <p className="text-gray-500 text-xl font-medium">اختبر سرعتك وذكاءك في تفاعل مباشر</p>
              </div>
              
              <div className="grid grid-cols-1 gap-12">
                 <MeshaalGame />
                 <MeshaalQuiz />
              </div>
            </div>
          </section>

          {/* Hobbies Section */}
          <section id="hobbies" className="py-24 px-6 bg-sky-50 relative overflow-hidden scroll-mt-24">
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-black text-gray-900 mb-4">هواياتي وشغفي</h2>
                <p className="text-gray-600 font-bold text-lg">أقضي وقتي في تنمية مواهبي المختلفة</p>
              </div>
              <div className="flex justify-center flex-wrap gap-10">
                <div className="bg-white p-10 rounded-[3rem] shadow-xl flex flex-col items-center gap-6 transition-all hover:scale-110 hover:shadow-2xl w-60 border border-sky-100 group">
                    <div className="p-6 bg-sky-50 text-sky-600 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Icons.Taekwondo />
                    </div>
                    <span className="font-black text-2xl text-gray-800">التايكوندو</span>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-xl flex flex-col items-center gap-6 transition-all hover:scale-110 hover:shadow-2xl w-60 border border-sky-100 group">
                    <div className="p-6 bg-sky-50 text-sky-600 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Icons.Sport />
                    </div>
                    <span className="font-black text-2xl text-gray-800">كرة القدم</span>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-xl flex flex-col items-center gap-6 transition-all hover:scale-110 hover:shadow-2xl w-60 border border-sky-100 group">
                    <div className="p-6 bg-sky-50 text-sky-600 rounded-full group-hover:bg-sky-500 group-hover:text-white transition-colors">
                      <Icons.Swimming />
                    </div>
                    <span className="font-black text-2xl text-gray-800">السباحة</span>
                </div>
              </div>
            </div>
          </section>

          {/* Skills & Stats */}
          <section id="skills" className="py-24 px-6 bg-white scroll-mt-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
              <div className="lg:w-1/2 w-full">
                <h2 className="text-4xl font-black mb-10 text-gray-900">المهارات الشخصية</h2>
                <div className="space-y-8">
                  {skills.map((skill, i) => (
                    <SkillBar key={i} skill={skill} />
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 w-full bg-gradient-to-br from-sky-600 to-indigo-700 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-125"></div>
                <h3 className="text-3xl font-bold mb-8 relative z-10">رؤيتي التعليمية ✨</h3>
                <p className="text-sky-50 text-xl leading-relaxed mb-12 italic relative z-10 font-medium">
                  "في مدرسة الأندلس، تعلمت أن النجاح يبدأ بخطوة صغيرة وبالإصرار نصل لأعلى المراتب. أطمح أن أكون بطلاً في الرياضة ومتميزاً في دراستي لخدمة وطني الغالي."
                </p>
                <div className="grid grid-cols-2 gap-8 relative z-10">
                  <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md text-center border border-white/10">
                    <span className="block text-4xl font-black mb-1">{achievements.length}</span>
                    <span className="text-sm font-bold opacity-80">إنجازات رئيسية</span>
                  </div>
                  <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md text-center border border-white/10">
                    <span className="block text-4xl font-black mb-1">🥇</span>
                    <span className="text-sm font-bold opacity-80">بطل التايكوندو</span>
                  </div>
                  <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md text-center border border-white/10">
                    <span className="block text-4xl font-black mb-1">{skills.length}</span>
                    <span className="text-sm font-bold opacity-80">مهارات احترافية</span>
                  </div>
                  <div className="bg-white/10 p-6 rounded-3xl backdrop-blur-md text-center border border-white/10">
                    <span className="block text-4xl font-black mb-1">100%</span>
                    <span className="text-sm font-bold opacity-80">طموح وشغف</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 px-6 bg-gray-50 scroll-mt-24">
            <div className="max-w-4xl mx-auto bg-white rounded-[3rem] p-12 shadow-2xl border border-gray-100">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black mb-4">لنترك أثراً معاً</h2>
                <p className="text-gray-500 font-bold">يمكنكم التواصل معي لأي استفسار أو تعاون تعليمي</p>
              </div>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 mr-2">الاسم</label>
                    <input type="text" placeholder="اسمك الكريم" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-sky-500/10 outline-none text-right transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 mr-2">البريد</label>
                    <input type="email" placeholder="بريدك الإلكتروني" className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-sky-500/10 outline-none text-right transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 mr-2">الرسالة</label>
                    <textarea rows={4} placeholder="اكتب رسالتك هنا..." className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50 focus:ring-4 focus:ring-sky-500/10 outline-none text-right transition-all" />
                </div>
                <button className="w-full bg-sky-500 text-white font-black text-xl py-5 rounded-2xl hover:bg-sky-600 shadow-xl shadow-sky-200 transition-all transform hover:-translate-y-1">
                  إرسال الرسالة الآن 🚀
                </button>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-20 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-right">
              <div>
                <div className="flex items-center gap-4 mb-6 justify-center md:justify-start flex-row-reverse">
                  <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-sky-500/20">م</div>
                  <span className="text-3xl font-black tracking-tight">إنجازاتي</span>
                </div>
                <p className="text-gray-400 text-lg max-w-sm leading-relaxed">
                  منصة توثيق رحلة الطالب المتميز {profile.name} في مدرسة الأندلس الأهلية.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <span className="text-gray-500 font-bold">روابط سريعة</span>
                <div className="flex gap-6 justify-center md:justify-start">
                  <a href="#home" className="hover:text-sky-500 transition-colors">الرئيسية</a>
                  <a href="#achievements" className="hover:text-sky-500 transition-colors">الإنجازات</a>
                  <a href="#skills" className="hover:text-sky-500 transition-colors">المهارات</a>
                </div>
              </div>
              <p className="text-gray-500 font-medium">
                © {new Date().getFullYear()} جميع الحقوق محفوظة لـ مشعل الغامدي.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default App;

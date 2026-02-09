
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AchievementCard from './components/AchievementCard';
import SkillBar from './components/SkillBar';
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
    hobbies: ["كرة القدم", "السباحة"]
  };

  const defaultAchievements: Achievement[] = [
    {
      id: '0',
      title: "بطل دوري المدارس 2025",
      category: 'sport',
      date: "2025",
      description: "تحقيق المركز الأول في بطولة دوري المدارس المرموقة، وقيادة فريق مدرسة الأندلس الأهلية لمنصة التتويج بجدارة.",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=600"
    },
    {
      id: '1',
      title: "وسام التميز الدراسي",
      category: 'academic',
      date: "الفصل الدراسي الأول 2024",
      description: "الحصول على المركز الأول في قائمة المتفوقين بمدرسة الأندلس الأهلية للمرحلة المتوسطة.",
      image: "https://picsum.photos/seed/award-andalus/600/400"
    }
  ];

  const defaultSkills: Skill[] = [
    { name: "مهارات كرة القدم", level: 95, category: "Sports" },
    { name: "الإلقاء والخطابة", level: 85, category: "Soft Skills" },
    { name: "العمل الجماعي والقيادة", level: 90, category: "Soft Skills" },
  ];

  // State with LocalStorage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('student_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('student_achievements');
    return saved ? JSON.parse(saved) : defaultAchievements;
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
      title: "إنجاز جديد",
      category: 'academic',
      date: "2025",
      description: "اكتب وصف الإنجاز هنا..."
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
      <Header />

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
            <h2 className="text-4xl font-black mb-12 text-gray-900 border-b pb-6">لوحة تحكم مشعل 🚀</h2>
            
            {/* Profile Section */}
            <div className="mb-16 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">البيانات الأساسية <span className="text-sm font-normal text-gray-400">(يتم الحفظ تلقائياً)</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2">الاسم الكامل</label>
                  <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">المدرسة</label>
                  <input value={profile.school} onChange={e => setProfile({...profile, school: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">الصف الدراسي</label>
                  <input value={profile.grade} onChange={e => setProfile({...profile, grade: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-2">النبذة التعريفية</label>
                  <textarea value={profile.bio} rows={4} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full p-4 rounded-xl border border-gray-200" />
                  <button onClick={handleImproveBio} disabled={isImprovingBio} className="mt-2 text-sky-600 font-bold hover:underline">
                    {isImprovingBio ? 'جاري تحسين النص...' : '✨ تحسين النبذة بالذكاء الاصطناعي'}
                  </button>
                </div>
              </div>
            </div>

            {/* Achievements Section */}
            <div className="mb-16">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">إدارة الإنجازات</h3>
                <button onClick={addAchievement} className="bg-sky-500 text-white px-4 py-2 rounded-lg font-bold">+ إضافة إنجاز</button>
              </div>
              <div className="space-y-4">
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input value={ach.title} onChange={e => updateAchievement(ach.id, 'title', e.target.value)} placeholder="عنوان الإنجاز" className="p-3 border rounded-lg" />
                      <input value={ach.date} onChange={e => updateAchievement(ach.id, 'date', e.target.value)} placeholder="التاريخ" className="p-3 border rounded-lg" />
                      <select value={ach.category} onChange={e => updateAchievement(ach.id, 'category', e.target.value as any)} className="p-3 border rounded-lg">
                        <option value="academic">أكاديمي</option>
                        <option value="sport">رياضي</option>
                        <option value="art">فني</option>
                        <option value="voluntary">تطوعي</option>
                      </select>
                      <input value={ach.image || ''} onChange={e => updateAchievement(ach.id, 'image', e.target.value)} placeholder="رابط الصورة (اختياري)" className="p-3 border rounded-lg" />
                    </div>
                    <textarea value={ach.description} onChange={e => updateAchievement(ach.id, 'description', e.target.value)} placeholder="وصف الإنجاز" className="w-full p-3 border rounded-lg mb-4" />
                    <button onClick={() => deleteAchievement(ach.id)} className="text-red-500 font-bold hover:underline">حذف الإنجاز</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">إدارة المهارات</h3>
                <button onClick={addSkill} className="bg-sky-500 text-white px-4 py-2 rounded-lg font-bold">+ إضافة مهارة</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill, index) => (
                  <div key={index} className="p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-4">
                    <input value={skill.name} onChange={e => updateSkill(index, 'name', e.target.value)} className="flex-1 p-2 border rounded" />
                    <input type="number" value={skill.level} onChange={e => updateSkill(index, 'level', parseInt(e.target.value))} className="w-20 p-2 border rounded" />
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
          <section id="home" className="pt-32 pb-20 px-6 gradient-bg">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <h2 className="text-sky-500 font-bold mb-2 text-lg">مرحباً بكم في ملف إنجازي</h2>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
                  أنا {profile.name} <br />
                  <span className="text-sky-600 font-medium text-2xl md:text-3xl">{profile.grade} - {profile.school}</span>
                </h1>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl leading-relaxed">
                  {profile.bio}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#contact" className="bg-sky-500 text-white px-8 py-3 rounded-full font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-200">
                    تواصل معي
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-sky-500/20 rounded-full blur-3xl"></div>
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="relative w-64 h-64 md:w-80 md:h-80 object-cover rounded-[3rem] shadow-2xl border-8 border-white"
                />
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section id="achievements" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">أبرز الإنجازات</h2>
                <div className="w-20 h-1.5 bg-sky-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            </div>
          </section>

          {/* Hobbies Section */}
          <section id="hobbies" className="py-20 px-6 bg-sky-50">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-black text-gray-900 mb-4">هواياتي المفضلة</h2>
                <p className="text-gray-600 font-medium">الأنشطة التي أستمتع بممارستها</p>
              </div>
              <div className="flex justify-center flex-wrap gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center gap-4 transition-transform hover:scale-105 w-48 border border-sky-100">
                    <div className="p-4 bg-sky-100 text-sky-600 rounded-full">
                      <Icons.Sport />
                    </div>
                    <span className="font-bold text-xl text-gray-800">كرة القدم</span>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center gap-4 transition-transform hover:scale-105 w-48 border border-sky-100">
                    <div className="p-4 bg-sky-100 text-sky-600 rounded-full">
                      <Icons.Swimming />
                    </div>
                    <span className="font-bold text-xl text-gray-800">السباحة</span>
                </div>
              </div>
            </div>
          </section>

          {/* Skills & Stats */}
          <section id="skills" className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-black mb-8">المهارات والقدرات</h2>
                <div className="space-y-6">
                  {skills.map((skill, i) => (
                    <SkillBar key={i} skill={skill} />
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2 bg-sky-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-center shadow-2xl">
                <h3 className="text-2xl font-bold mb-6">رؤيتي التعليمية</h3>
                <p className="text-sky-100 text-lg leading-relaxed mb-8 italic">
                  "في مدرسة الأندلس، تعلمت أن النجاح يبدأ بخطوة صغيرة وبالإصرار نصل لأعلى المراتب. أطمح أن أكون بطلاً في الرياضة ومتميزاً في دراستي لخدمة وطني الغالي."
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm text-center">
                    <span className="block text-3xl font-black">{achievements.length}</span>
                    <span className="text-sm opacity-80">إنجازات رئيسية</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm text-center">
                    <span className="block text-3xl font-black">بطل</span>
                    <span className="text-sm opacity-80">دوري المدارس</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm text-center">
                    <span className="block text-3xl font-black">{skills.length}</span>
                    <span className="text-sm opacity-80">مهارات مكتسبة</span>
                  </div>
                  <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm text-center">
                    <span className="block text-3xl font-black">100%</span>
                    <span className="text-sm opacity-80">التزام دراسي</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-24 px-6 bg-gray-50">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-black mb-8">تواصل معي</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="الاسم الكامل" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 text-right" />
                  <input type="email" placeholder="البريد الإلكتروني" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 text-right" />
                </div>
                <textarea rows={4} placeholder="رسالتك" className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sky-500 text-right" />
                <button className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl hover:bg-sky-600 shadow-lg shadow-sky-100 transition-all">
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-right">
              <div>
                <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center text-white font-bold">م</div>
                  <span className="text-xl font-bold">إنجازاتي الرقمي</span>
                </div>
                <p className="text-gray-400 text-sm max-w-xs">
                  توثيق رحلة {profile.name} في مدرسة الأندلس الأهلية.
                </p>
              </div>
              <p className="text-gray-500 text-sm">
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

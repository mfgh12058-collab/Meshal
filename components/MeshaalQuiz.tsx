
import React, { useState } from 'react';

const QUESTIONS = [
  {
    question: "في أي مدرسة يدرس البطل مشعل الغامدي؟",
    options: ["مدرسة التميز", "مدرسة الأندلس الأهلية", "مدرسة الموهوبين", "مدرسة القمة"],
    correct: 1
  },
  {
    question: "ما هو الصف الدراسي الحالي لمشعل؟",
    options: ["الصف السادس", "الصف الثامن", "الصف السابع", "الصف التاسع"],
    correct: 2
  },
  {
    question: "في أي رياضة حقق مشعل المركز الأول في عام 2025؟",
    options: ["السباحة", "كرة القدم", "التايكوندو", "الجري"],
    correct: 2
  },
  {
    question: "ما هو المركز الذي حققه مشعل في وسام التميز الدراسي بمدرسة الساحل؟",
    options: ["المركز الأول", "المركز الثاني", "المركز الثالث", "المركز الرابع"],
    correct: 1
  },
  {
    question: "ما هو طموح مشعل المذكور في رؤيته؟",
    options: ["أن يصبح طياراً", "أن يصبح بطلاً رياضياً ومتميزاً دراسياً", "أن يسافر حول العالم", "أن يفتتح نادياً رياضياً"],
    correct: 1
  }
];

const MeshaalQuiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    const correct = index === QUESTIONS[currentQuestion].correct;
    setIsCorrect(correct);
    if (correct) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(c => c + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowResult(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-2xl mx-auto my-12 bg-white rounded-[2.5rem] shadow-xl border border-sky-100 overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-8 text-white text-center">
        <h3 className="text-2xl font-black mb-2">تحدي ذكاء مشعل 🧠</h3>
        <p className="opacity-90 font-bold">هل تعرف مشعل حقاً؟ اختبر معلوماتك!</p>
      </div>

      <div className="p-8 md:p-12">
        {!showResult ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs font-black text-sky-600 mb-2">
                <span>السؤال {currentQuestion + 1} من {QUESTIONS.length}</span>
                <span>{Math.round(((currentQuestion) / QUESTIONS.length) * 100)}%</span>
              </div>
              <div className="w-full bg-sky-50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-sky-500 h-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h4 className="text-2xl font-black text-gray-800 mb-8 text-center leading-relaxed">
              {QUESTIONS[currentQuestion].question}
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {QUESTIONS[currentQuestion].options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedAnswer !== null}
                  className={`
                    w-full p-5 rounded-2xl text-right font-bold text-lg transition-all transform active:scale-95
                    ${selectedAnswer === null ? 'bg-gray-50 hover:bg-sky-50 hover:text-sky-600 border-2 border-transparent' : ''}
                    ${selectedAnswer === idx && isCorrect ? 'bg-green-100 border-green-500 text-green-700' : ''}
                    ${selectedAnswer === idx && !isCorrect ? 'bg-red-100 border-red-500 text-red-700' : ''}
                    ${selectedAnswer !== null && idx === QUESTIONS[currentQuestion].correct && !isCorrect ? 'bg-green-50 border-green-200 text-green-600' : ''}
                    ${selectedAnswer !== null && selectedAnswer !== idx ? 'opacity-50' : 'border-2'}
                  `}
                >
                  <div className="flex items-center justify-between flex-row-reverse">
                    <span>{option}</span>
                    {selectedAnswer === idx && (
                      <span>{isCorrect ? '✅' : '❌'}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 animate-in zoom-in duration-500">
            <div className="text-7xl mb-6">
              {score === QUESTIONS.length ? '👑' : score >= 3 ? '👏' : '💪'}
            </div>
            <h4 className="text-3xl font-black text-gray-900 mb-2">نتيجتك النهائية</h4>
            <p className="text-5xl font-black text-sky-600 mb-6">{score} / {QUESTIONS.length}</p>
            <p className="text-gray-500 font-bold mb-10 text-lg leading-relaxed">
              {score === QUESTIONS.length 
                ? 'مذهل! أنت تعرف مشعل كما يعرف نفسه! ✨' 
                : score >= 3 
                ? 'أداء رائع! لديك معرفة جيدة بمسيرة مشعل. 👍' 
                : 'لا بأس، يمكنك التعرف أكثر على مشعل من خلال تصفح ملفه! 📖'}
            </p>
            <button 
              onClick={resetQuiz}
              className="bg-sky-500 text-white px-10 py-4 rounded-2xl font-black text-xl hover:bg-sky-600 shadow-xl shadow-sky-200 transition-all"
            >
              إعادة التحدي 🔄
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeshaalQuiz;

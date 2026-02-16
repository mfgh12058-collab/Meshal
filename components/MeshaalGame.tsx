
import React, { useState, useEffect, useRef } from 'react';

const ITEMS = [
  { emoji: '🏆', points: 15, type: 'achievement', speed: 1.5 },
  { emoji: '⚽', points: 10, type: 'sport', speed: 1.5 },
  { emoji: '📚', points: 10, type: 'academic', speed: 1.5 },
  { emoji: '🥋', points: 12, type: 'taekwondo', speed: 1.5 },
  { emoji: '🎮', points: -5, type: 'distraction', speed: 1.8 },
  { emoji: '🪨', points: 0, type: 'obstacle', speed: 2.2 }, // الحجر يسقط أسرع
];

const MeshaalGame: React.FC = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [fallingItems, setFallingItems] = useState<{ id: number; x: number; y: number; itemIndex: number }[]>([]);
  const [isHit, setIsHit] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setFallingItems([]);
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPlayerPosition(Math.max(0, Math.min(100, x)));
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    // توليد العناصر
    const interval = setInterval(() => {
      setFallingItems((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: Math.random() * 90 + 5,
          y: -10,
          itemIndex: Math.floor(Math.random() * ITEMS.length),
        },
      ]);
    }, 700);

    // حلقة التحديث
    const updateLoop = () => {
      setFallingItems((prev) => {
        const next = prev
          .map((item) => ({ ...item, y: item.y + ITEMS[item.itemIndex].speed }))
          .filter((item) => item.y < 100);

        // اكتشاف التصادم
        const caught = next.filter((item) => {
          const isNearX = Math.abs(item.x - playerPosition) < 8;
          const isNearY = item.y > 82 && item.y < 92;
          return isNearX && isNearY;
        });

        if (caught.length > 0) {
          caught.forEach(item => {
            const caughtItem = ITEMS[item.itemIndex];
            if (caughtItem.type === 'obstacle') {
              setLives(l => {
                const newLives = l - 1;
                if (newLives <= 0) setGameState('gameover');
                return newLives;
              });
              setIsHit(true);
              setTimeout(() => setIsHit(false), 200);
            } else {
              setScore(s => s + caughtItem.points);
            }
          });
          return next.filter(item => !caught.includes(item));
        }

        return next;
      });
      requestRef.current = requestAnimationFrame(updateLoop);
    };

    requestRef.current = requestAnimationFrame(updateLoop);

    // وقت اللعبة
    const timer = setTimeout(() => {
      setGameState('gameover');
    }, 45000); // زيادة الوقت قليلاً لزيادة المتعة

    return () => {
      clearInterval(interval);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      clearTimeout(timer);
    };
  }, [gameState, playerPosition]);

  return (
    <div 
      className={`max-w-4xl mx-auto my-20 bg-white rounded-[3rem] shadow-2xl overflow-hidden border-8 transition-colors duration-200 ${isHit ? 'border-red-500 animate-bounce' : 'border-sky-100'} relative`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleMouseMove}
      ref={gameAreaRef}
    >
      <div className="bg-sky-500 p-6 text-white flex justify-between items-center font-black">
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className={`text-2xl transition-opacity ${i < lives ? 'opacity-100' : 'opacity-20'}`}>❤️</span>
          ))}
        </div>
        <span className="text-xl hidden md:block">تحدي مشعل: تفادى الأحجار! 🪨</span>
        <span className="text-2xl bg-white/20 px-4 py-1 rounded-xl">النقاط: {score}</span>
      </div>

      <div className="h-[550px] relative bg-gradient-to-b from-sky-50 to-white cursor-none overflow-hidden">
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-20">
            <h3 className="text-3xl font-black text-gray-900 mb-4 text-center px-4">ساعد مشعل في جمع إنجازاته وتجنب العقبات!</h3>
            <div className="flex gap-6 mb-8 text-center font-bold">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-green-100">
                <span className="block text-3xl">🏆📚⚽</span>
                <span className="text-green-600">اجمع للنقاط</span>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-red-100">
                <span className="block text-3xl">🪨🎮</span>
                <span className="text-red-600">تفادى الأحجار</span>
              </div>
            </div>
            <button 
              onClick={startGame}
              className="bg-sky-500 text-white px-12 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl shadow-sky-200"
            >
              بدأ التحدي 🚀
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-600/90 backdrop-blur-md z-20 text-white animate-in zoom-in duration-300">
            <h3 className="text-4xl font-black mb-2">انتهى التحدي! 🏁</h3>
            <div className="text-6xl font-black mb-4">{score} نقطة</div>
            <p className="mb-8 font-bold text-sky-100 text-xl">
              {lives <= 0 ? 'لقد اصطدمت بالكثير من الأحجار! 🪨' : 'انتهى الوقت، أداء رائع! ✨'}
            </p>
            <button 
              onClick={startGame}
              className="bg-white text-sky-600 px-12 py-4 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl"
            >
              حاول مرة أخرى 🔄
            </button>
          </div>
        )}

        {/* Falling Items */}
        {fallingItems.map((item) => (
          <div
            key={item.id}
            className={`absolute select-none transition-all duration-75 ${ITEMS[item.itemIndex].type === 'obstacle' ? 'text-5xl drop-shadow-lg' : 'text-4xl'}`}
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`,
              transform: 'translateX(-50%)'
            }}
          >
            {ITEMS[item.itemIndex].emoji}
          </div>
        ))}

        {/* Player (Meshaal) */}
        <div 
          className="absolute bottom-4 transition-all duration-75 ease-out select-none"
          style={{ left: `${playerPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className={`relative transition-transform ${isHit ? 'scale-125' : 'scale-100'}`}>
             <div className={`w-20 h-20 bg-white rounded-2xl shadow-xl border-4 overflow-hidden flex items-center justify-center transition-colors ${isHit ? 'border-red-500 bg-red-50' : 'border-sky-500'}`}>
                <img src="https://picsum.photos/seed/meshaal/200/200" alt="Meshaal" className={`w-full h-full object-cover ${isHit ? 'grayscale opacity-50' : ''}`} />
             </div>
             {isHit && (
               <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                 💥
               </div>
             )}
             <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-sky-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black shadow-lg">
                مشعل
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 flex justify-center gap-8 text-gray-500 text-sm font-bold border-t">
        <span className="flex items-center gap-1">🏆 = 15+</span>
        <span className="flex items-center gap-1">🪨 = فقدان حياة ❤️</span>
        <span className="flex items-center gap-1">🎮 = 5-</span>
      </div>
    </div>
  );
};

export default MeshaalGame;

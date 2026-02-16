
import React from 'react';
import { Achievement } from '../types';
import { Icons } from '../constants';

interface Props {
  achievement: Achievement;
}

const AchievementCard: React.FC<Props> = ({ achievement }) => {
  const IconComponent = Icons[achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1) as keyof typeof Icons] || Icons.Academic;

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full">
      {/* Achievement Image - Prominent at the top */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={achievement.image || "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800"} 
          alt={achievement.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-sky-600 rounded-2xl shadow-lg">
          <IconComponent />
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-sky-50 text-sky-600 text-xs font-bold rounded-full mb-2">
            {achievement.date}
          </span>
          <h3 className="font-black text-xl text-gray-900 leading-tight mb-3">
            {achievement.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;

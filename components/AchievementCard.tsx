
import React from 'react';
import { Achievement } from '../types';
import { Icons } from '../constants';

interface Props {
  achievement: Achievement;
}

const AchievementCard: React.FC<Props> = ({ achievement }) => {
  const IconComponent = Icons[achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1) as keyof typeof Icons] || Icons.Academic;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
          <IconComponent />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800">{achievement.title}</h3>
          <span className="text-sm text-gray-500 font-medium">{achievement.date}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {achievement.description}
      </p>
      {achievement.image && (
        <img 
          src={achievement.image} 
          alt={achievement.title} 
          className="w-full h-40 object-cover rounded-lg"
        />
      )}
    </div>
  );
};

export default AchievementCard;

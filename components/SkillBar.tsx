
import React from 'react';
import { Skill } from '../types';

interface Props {
  skill: Skill;
}

const SkillBar: React.FC<Props> = ({ skill }) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-semibold text-gray-700">{skill.name}</span>
        <span className="text-xs text-gray-500 font-bold">{skill.level}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-sky-500 h-2 rounded-full transition-all duration-1000" 
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  );
};

export default SkillBar;

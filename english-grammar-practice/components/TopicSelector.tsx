
import React from 'react';
import type { GrammarTopic } from '../types';

interface TopicSelectorProps {
  topics: GrammarTopic[];
  selectedTopicId: string | null;
  onSelectTopic: (topic: GrammarTopic) => void;
  isLoading: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ topics, selectedTopicId, onSelectTopic, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">Choose a Grammar Topic</h2>
      <div className="flex flex-wrap gap-3">
        {topics.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic)}
            disabled={isLoading}
            className={`
              px-4 py-2 rounded-full font-semibold text-sm transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent
              ${selectedTopicId === topic.id 
                ? 'bg-primary text-white shadow-lg' 
                : 'bg-light text-secondary hover:bg-accent hover:text-white'}
              ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
            `}
          >
            {topic.name}
          </button>
        ))}
      </div>
    </div>
  );
};


import React from 'react';
import type { Exercise } from '../types';
import { ExerciseType } from '../types';

interface ExerciseDisplayProps {
  exercises: Exercise[];
  userAnswers: (string | undefined)[];
  onAnswerChange: (exerciseIndex: number, answer: string) => void;
  results: (boolean | null)[];
}

const getBorderColor = (result: boolean | null) => {
  if (result === null) return 'border-gray-300';
  return result ? 'border-correct' : 'border-incorrect';
};

export const ExerciseDisplay: React.FC<ExerciseDisplayProps> = ({ exercises, userAnswers, onAnswerChange, results }) => {
  return (
    <div className="space-y-6">
      {exercises.map((exercise, index) => (
        <div key={index} className={`bg-white p-6 rounded-xl shadow-md border-2 ${getBorderColor(results[index])}`}>
          <p className="font-semibold text-gray-800 mb-4">{index + 1}. {exercise.question.replace('____', '______')}</p>
          
          {exercise.type === ExerciseType.MultipleChoice && exercise.options && (
            <div className="space-y-3">
              {exercise.options.map((option, optionIndex) => (
                <label key={optionIndex} className="flex items-center p-3 rounded-lg hover:bg-light transition-colors cursor-pointer">
                  <input
                    type="radio"
                    name={`exercise-${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={(e) => onAnswerChange(index, e.target.value)}
                    disabled={results[index] !== null}
                    className="h-4 w-4 text-primary focus:ring-accent border-gray-300"
                  />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          )}

          {(exercise.type === ExerciseType.GapFilling || exercise.type === ExerciseType.ShortAnswer) && (
            <input
              type="text"
              value={userAnswers[index] || ''}
              onChange={(e) => onAnswerChange(index, e.target.value)}
              disabled={results[index] !== null}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
              placeholder="Your answer..."
            />
          )}

          {results[index] !== null && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${results[index] ? 'bg-green-100 text-correct' : 'bg-red-100 text-incorrect'}`}>
              {results[index] ? (
                <span><strong>Correct!</strong> Well done.</span>
              ) : (
                <span><strong>Incorrect.</strong> The correct answer is: <strong>{exercise.answer}</strong></span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

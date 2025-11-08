import React, { useState, useCallback } from 'react';
import { generateExercises } from './services/geminiService';
import { TopicSelector } from './components/TopicSelector';
import { ExerciseDisplay } from './components/ExerciseDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import type { GrammarTopic, Exercise } from './types';

const grammarTopics: GrammarTopic[] = [
    { id: 'tenses', name: 'Basic Verb Tenses', theory: 'Present Simple: S + V1/V(s/es). Describes habits, facts.\nPresent Continuous: S + am/is/are + V-ing. Action happening now.\nPresent Perfect: S + has/have + P.P. Action from past continuing to present.\nPast Simple: S + V2/V-ed. Action finished in the past.\nPast Continuous: S + was/were + V-ing. Action in progress at a specific past time.\nPast Perfect: S + had + P.P. Action happened before another past action.\nFuture Simple: S + will/shall + V1. Future action (decision at speaking time).' },
    { id: 'passive', name: 'Passive Voice', theory: 'Active: S + V + O. -> Passive: S(O) + be + V(P.P) + by + O(S).\nPresent Simple: am/is/are + P.P\nPresent Continuous: am/is/are + being + P.P\nPresent Perfect: has/have + been + P.P\nPast Simple: was/were + P.P\nPast Continuous: was/were + being + P.P\nPast Perfect: had + been + P.P\nFuture Simple: will/shall + be + P.P' },
    { id: 'wish', name: 'Wish Clauses', theory: 'Wish for Present: S + wish(es) + S + V2/-ed (to be: were).\nWish for Past: S + wish(es) + S + had + P.P.\nWish for Future: S + wish(es) + S + would + V1.' },
    { id: 'conditional', name: 'Conditional Sentences', theory: 'Type 1 (Real): If S + V1/V-s(es), S + will/can/may + V1.\nType 2 (Unreal Present): If S + V2/V-ed (to be: were), S + would/could/should + V1.\nType 3 (Unreal Past): If S + had + P.P, S + would/could/should + have + P.P.' },
    { id: 'reported', name: 'Reported Speech', theory: 'Command: S + asked/told + O + (not) + to + V1.\nStatement: S + told/said + (O) + (that) + clause (backshift tense).\nYes/No Q: S + asked + O + if/whether + S + V + O (backshift tense).\nWh- Q: S + asked + O + Wh- + S + V + O (backshift tense).' },
    { id: 'relative', name: 'Relative Clauses', theory: 'Who: for people (subject).\nWhom: for people (object).\nWhich: for things.\nWhose: for possession.\nWhy/Where/When: for reason, place, time.\nThat: for who, whom, which in defining clauses.' },
    { id: 'comparison', name: 'Comparison', theory: 'Equality: as + adj/adv + as.\nComparative (short): adj/adv-er + than.\nComparative (long): more + adj/adv + than.\nSuperlative (short): the + adj/adv-est.\nSuperlative (long): the most + adj/adv.' },
    { id: 'phrasal', name: 'Phrasal Verbs', theory: 'Beat one’s self up: self-blame.\nBreak down: stop functioning.\nCall for: require.\nCarry out: perform a task.\nCatch up with: reach the same level.\nCheck in: register.\nCut off: interrupt supply.\nEnd up: finally be in a state/place.\nFigure out: understand/solve.\nGet along with: have a good relationship.\nGive up: quit.\nLet sb down: disappoint someone.\nLook after sb: take care of.' },
];

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<GrammarTopic | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [userAnswers, setUserAnswers] = useState<(string | undefined)[]>([]);
  const [results, setResults] = useState<(boolean | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<number | null>(null);

  const handleSelectTopic = useCallback(async (topic: GrammarTopic) => {
    setSelectedTopic(topic);
    setIsLoading(true);
    setError(null);
    setExercises([]);
    setUserAnswers([]);
    setResults([]);
    setScore(null);
    try {
      const newExercises = await generateExercises(topic);
      setExercises(newExercises);
      setUserAnswers(new Array(newExercises.length).fill(undefined));
      setResults(new Array(newExercises.length).fill(null));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleAnswerChange = (exerciseIndex: number, answer: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[exerciseIndex] = answer;
      return newAnswers;
    });
  };

  const checkAnswers = () => {
    const newResults = exercises.map((exercise, index) => {
      const userAnswer = userAnswers[index]?.trim().toLowerCase();
      const correctAnswer = exercise.answer.trim().toLowerCase();
      return userAnswer === correctAnswer;
    });
    setResults(newResults);

    const correctCount = newResults.filter(Boolean).length;
    const totalCount = exercises.length;
    if (totalCount > 0) {
      const calculatedScore = (10 * correctCount) / totalCount;
      setScore(calculatedScore);
    }
  };

  const allAnswered = userAnswers.every(answer => answer !== undefined && answer.trim() !== '');

  return (
    <div className="min-h-screen bg-light">
      <header className="bg-primary shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-white tracking-wide">English Grammar Practice</h1>
          <p className="text-blue-200 mt-1">Hone your skills with AI-powered exercises</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TopicSelector 
            topics={grammarTopics}
            selectedTopicId={selectedTopic?.id || null}
            onSelectTopic={handleSelectTopic}
            isLoading={isLoading}
          />

          {isLoading && <LoadingSpinner />}
          
          {error && (
            <div className="bg-red-100 border-l-4 border-incorrect text-incorrect p-4 rounded-md shadow-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {exercises.length > 0 && !isLoading && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-primary mb-6">Exercises: {selectedTopic?.name}</h3>
              {score !== null && (
                <div className="mb-6 p-4 bg-accent text-white rounded-lg text-center shadow-inner">
                  <p className="text-2xl font-bold">Your Score: <span className="text-yellow-300">{score.toFixed(1)} / 10</span></p>
                </div>
              )}
              <ExerciseDisplay 
                exercises={exercises}
                userAnswers={userAnswers}
                onAnswerChange={handleAnswerChange}
                results={results}
              />
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={checkAnswers}
                  disabled={!allAnswered || results.some(r => r !== null)}
                  className="w-full sm:w-auto flex-grow px-6 py-3 bg-secondary text-white font-bold rounded-lg shadow-md hover:bg-primary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                  Check Answers
                </button>
                <button
                  onClick={() => selectedTopic && handleSelectTopic(selectedTopic)}
                  disabled={isLoading}
                  className="w-full sm:w-auto flex-grow px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg shadow-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-wait focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Generate New Exercises
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;
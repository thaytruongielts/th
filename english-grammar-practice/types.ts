
export interface GrammarTopic {
  id: string;
  name: string;
  theory: string;
}

export enum ExerciseType {
  MultipleChoice = 'multiple-choice',
  GapFilling = 'gap-filling',
  ShortAnswer = 'short-answer',
}

export interface Exercise {
  type: ExerciseType;
  question: string;
  options?: string[];
  answer: string;
}

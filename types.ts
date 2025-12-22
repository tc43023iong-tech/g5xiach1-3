
export enum QuestionType {
  MC = 'MC',
  FILL_IN = 'FILL_IN',
  MATCHING = 'MATCHING'
}

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  prompt: string;
  options?: Option[];
  correctAnswer: string;
  note?: string;
  context?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

export enum AppState {
  MENU = 'MENU',
  LESSON = 'LESSON',
  SUMMARY = 'SUMMARY'
}

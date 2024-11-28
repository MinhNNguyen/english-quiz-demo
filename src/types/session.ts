export enum SessionState {
  OPEN = 'open',
  RUNNING = 'running',
  FINISHED = 'finished'
}

export const SessionCategoryMap = {
  1: 'Basic English Vocab I',
  2: 'Basic English Vocab II',
  3: 'Intermediate English Vocab I',
  4: 'Geographic English Vocab I'
};

export interface SessionI {
  id: number;
  category: number;
  participants: number;
  status: SessionState;
}

export interface QuestionI {
  title: string;
  choices: string[];
  answer: number;
  user: number | null;
}

export interface SessionUserI {
  name: string;
  score: number;
}

export interface SessionDetailI {
  id: number;
  category: number;
  start: number;
  end: number;
  questions: QuestionI[];
}

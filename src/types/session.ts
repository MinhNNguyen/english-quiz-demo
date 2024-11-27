export enum SessionState {
  OPEN = 'open',
  RUNNING = 'running',
  FINISHED = 'finished'
}

export const SessionCategoryMap = {
  1: 'Basic English Vocab I',
  2: 'Basic English Vocab II',
  3: 'Intermediate English Vocab I'
};

export interface SessionI {
  id: number;
  category: number;
  participants: number;
  status: SessionState;
}

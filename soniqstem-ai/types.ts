
export enum AppState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED'
}

export interface AudioFile {
  name: string;
  size: number;
  type: string;
  duration?: number;
}

export interface ProcessingStep {
  id: number;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

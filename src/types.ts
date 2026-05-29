export type PageType = 
  | 'login'
  | 'dashboard' 
  | 'reports' 
  | 'knowledge' 
  | 'prompts' 
  | 'content' 
  | 'distribution' 
  | 'databoard' 
  | 'settings';

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface Shop {
  id: string;
  name: string;
  industry: 'restaurant' | 'spa' | 'hotel';
}

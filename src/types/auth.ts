
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'coordinator' | 'user';
  group_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  coordinator_id?: string;
  powerbi_link?: string;
  form_link?: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  published_at: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  category?: string;
  is_urgent?: boolean;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

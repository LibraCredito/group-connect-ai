
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
  category?: string;
  image_url?: string;
  is_urgent?: boolean;
  is_active?: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  file_type?: string;
  category?: string;
  is_active?: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

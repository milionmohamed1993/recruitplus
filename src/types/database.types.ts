export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Job, 'id'>>;
      };
      candidates: {
        Row: Candidate;
        Insert: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Candidate, 'id'>>;
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'date_applied'>;
        Update: Partial<Omit<Application, 'id'>>;
      };
    };
  };
}

export interface Candidate {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  position: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  company: string | null;
  department: string | null;
  industry: string | null;
  experience: string | null;
  education: string | null;
  university: string | null;
  birthdate: string | null;
  address: string | null;
  nationality: string | null;
  location: string | null;
  source: string | null;
  work_reference: string | null;
  work_reference_evaluation: string | null;
  skills: string[] | null;
  skill_ratings: { name: string; rating: number }[] | null;
  gender: string | null;
  notice_period: string | null;
  preferred_work_model: string | null;
  salary_expectation: string | null;
  salary_flexibility: string | null;
  soft_skills: string[] | null;
  project_experience: string | null;
  certificates: string[] | null;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string[];
  salary_range: string | null;
  location: string | null;
  client_id: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  candidate_id: number;
  job_id: number;
  status: string;
  date_applied: string;
  jobs?: {
    title: string;
  };
}
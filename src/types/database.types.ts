export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: Job
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Job, 'id'>>
      }
      candidates: {
        Row: Candidate
        Insert: Omit<Candidate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Candidate, 'id'>>
      }
      clients: {
        Row: Client
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Client, 'id'>>
      }
      applications: {
        Row: Application
        Insert: Omit<Application, 'id' | 'date_applied'>
        Update: Partial<Omit<Application, 'id'>>
      }
    }
  }
}

export interface Candidate {
  id: number
  name: string
  email: string
  phone: string | null
  position: string
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired'
  created_at: string
  updated_at: string
}

export interface WorkExperience {
  id: number
  candidate_id: number
  title: string
  company: string
  duration: string
  description: string
}

export interface Education {
  id: number
  candidate_id: number
  degree: string
  university: string
  graduation_date: string
}

export interface Job {
  id: number
  title: string
  description: string
  requirements: string[]
  salary_range: string | null
  location: string | null
  client_id: number
  created_at: string
  updated_at: string
}

export interface Client {
  id: number
  name: string
  contact_info: string
  company_details: string | null
  created_at: string
  updated_at: string
}

export interface Application {
  id: number
  candidate_id: number
  job_id: number
  status: 'applied' | 'reviewing' | 'interviewed' | 'offered' | 'rejected'
  date_applied: string
  jobs?: {
    title: string
  }
}
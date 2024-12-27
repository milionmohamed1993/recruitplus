import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Job } from '@/types/database.types'

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async (): Promise<Job[]> => {
      console.log('Fetching jobs...')
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching jobs:', error)
        throw error
      }

      console.log('Jobs fetched successfully:', data)
      return data
    },
  })
}
import { Goal } from './goal'

export interface UserProfile {
  id: string
  email: string
  firstName?: string
  lastName?: string
  createdAt: string
  updatedAt?: string
  // Add other fields as needed
  goals?: Goal[] // Optional, if you want to include goals in the profile
}

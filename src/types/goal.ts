export interface Goal {
  id?: string
  title: string
  status?: 'active' | 'completed'
  createdBy?: string
}

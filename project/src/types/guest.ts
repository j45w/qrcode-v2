export interface Guest {
  id: string
  unique_code: string
  full_name: string
  email: string | null
  scanned: boolean
  scanned_at: string | null
  created_at: string
}
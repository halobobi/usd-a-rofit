import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const SupaBaseUrl = "https://smklpurtbquxaibvbitu.supabase.co"
const SupaBaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNta2xwdXJ0YnF1eGFpYnZiaXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2NDMxNDcsImV4cCI6MjAzMDIxOTE0N30.BVvQzie-rOMT1_Rkg-y1qTRQsk333-oWAL6EACBojhI"

const supabase = createClient(SupaBaseUrl, SupaBaseKey)

export default supabase
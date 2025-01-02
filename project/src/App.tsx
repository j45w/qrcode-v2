import React from 'react'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { ForgotPassword } from './pages/ForgotPassword'
import { Dashboard } from './pages/Dashboard'
import { ScanPage } from './pages/ScanPage'
import { CheckPage } from './pages/CheckPage'
import { AddGuestPage } from './pages/AddGuestPage'
import { GuestListPage } from './pages/GuestListPage'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (loading) {
    return null
  }

  // Simple client-side routing
  const path = window.location.pathname
  
  const publicRoutes = {
    '/': SignIn,
    '/signin': SignIn,
    '/signup': SignUp,
    '/forgot-password': ForgotPassword
  }

  const privateRoutes = {
    '/': Dashboard,
    '/scan': ScanPage,
    '/check': CheckPage,
    '/add': AddGuestPage,
    '/guests': GuestListPage
  }
  
  // If user is authenticated, only allow private routes
  if (session) {
    const Component = privateRoutes[path as keyof typeof privateRoutes] || Dashboard
    return <Component />
  }

  // If user is not authenticated, only allow public routes
  const Component = publicRoutes[path as keyof typeof publicRoutes] || SignIn
  
  return (
    <Component />
  )
}
export default App

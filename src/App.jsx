import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import FeedbackForm from './components/FeedbackForm'
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import './App.css'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => setSession(session)
    )
    window.addEventListener('show-admin-login', () => setShowLogin(true))
    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div className='loading'>Loading...</div>

  return (
    <>
      {session ? (
        <AdminDashboard session={session} />
      ) : (
        <>
          <FeedbackForm />
          {showLogin && <AdminLogin onClose={() => setShowLogin(false)} />}
        </>
      )}
    </>
  )
}
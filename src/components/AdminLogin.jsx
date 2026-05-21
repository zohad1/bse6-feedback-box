import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AdminLogin({ onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <div className='modal-icon'>🔒</div>
        <h2>Admin Access</h2>
        <p className='modal-sub'>Sign in to manage feedback submissions.</p>
        {error && <p className='error-msg'>{error}</p>}
        <form onSubmit={handleLogin}>
          <input type='email' placeholder='Email address' value={email}
            onChange={e => setEmail(e.target.value)} required />
          <input type='password' placeholder='Password' value={password}
            onChange={e => setPassword(e.target.value)} required />
          <button type='submit' className='modal-submit' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <button className='cancel-btn' onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
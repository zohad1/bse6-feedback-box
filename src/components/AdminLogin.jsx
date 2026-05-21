import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function AdminLogin({ onClose }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const firstRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    setTimeout(() => firstRef.current?.focus(), 50)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className='modal-backdrop' onMouseDown={onClose}>
      <div className='modal' onMouseDown={e => e.stopPropagation()} role='dialog' aria-modal='true'>
        <h3>Admin sign in</h3>
        <p className='modal-sub'>Authorized reviewers only. Anonymous submitters never see this screen.</p>

        {error && <p className='error-msg'>{error}</p>}

        <form onSubmit={handleLogin}>
          <div className='form-row'>
            <label className='field-label' htmlFor='email'>Email</label>
            <input
              id='email'
              ref={firstRef}
              type='email'
              className='input'
              placeholder='Email address'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete='email'
            />
          </div>
          <div className='form-row'>
            <label className='field-label' htmlFor='pw'>Password</label>
            <input
              id='pw'
              type='password'
              className='input'
              placeholder='Password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete='current-password'
            />
          </div>

          <div className='modal-actions'>
            <button type='button' className='btn btn-ghost' onClick={onClose}>Cancel</button>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {loading
                ? 'Signing in…'
                : <span style={{display:'inline-flex',alignItems:'center',gap:8}}>Sign in <ArrowRightIcon /></span>
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = [
  { id: 'General',          label: 'General',          dot: '#5A5247', bg: '#ECE8E0', text: '#5A5247' },
  { id: 'Bug Report',       label: 'Bug Report',       dot: '#C2410C', bg: '#FCEBE0', text: '#8B3A20' },
  { id: 'Feature Request',  label: 'Feature Request',  dot: '#3B5BDB', bg: '#E4EAF8', text: '#2A3F7A' },
  { id: 'Complaint',        label: 'Complaint',        dot: '#B7791F', bg: '#FAEFD3', text: '#7A5A1A' },
  { id: 'Suggestion',       label: 'Suggestion',       dot: '#3B6B1F', bg: '#E8EFE0', text: '#3B5A1F' },
]

const CheckBigIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M6 14.5L11.5 20 22 9" stroke="#1F3D2C" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
    <rect x="2.5" y="5.5" width="7" height="5" rx="1.2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M4 5.5V4a2 2 0 1 1 4 0v1.5" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
)

const MAX = 1000

export default function FeedbackForm() {
  const [message, setMessage]   = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const taRef = useRef(null)

  const len       = message.length
  const overWarn  = len > MAX * 0.85
  const overError = len > MAX
  const canSubmit = category && message.trim().length >= 4 && !overError

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)
    const { error } = await supabase.from('feedback').insert([{ message, category }])
    if (error) {
      alert('Error submitting feedback: ' + error.message)
    } else {
      setSuccess(true)
    }
    setLoading(false)
  }

  const reset = () => {
    setMessage('')
    setCategory('')
    setSuccess(false)
    setTimeout(() => taRef.current?.focus(), 60)
  }

  return (
    <div className='page'>
      <div className='public-top'>
        <div className='brand'>
          <span className='brand-mark'>f</span>
          <span className='brand-name'>feedback</span>
        </div>
        <span className='meta'>
          <span className='pulse' /> Accepting feedback
        </span>
      </div>

      <div className='public-card'>
        {!success ? (
          <>
            <h1>Tell us <em>anything.</em></h1>
            <p className='sub'>
              Anonymous by design. We don't capture your name, email, or any identifier — just the message you choose to share.
            </p>

            <form onSubmit={handleSubmit}>
              <div className='form-row'>
                <label className='field-label' htmlFor='cat'>Category</label>
                <select
                  id='cat'
                  className='select'
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value='' disabled>Choose a category…</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className='form-row'>
                <label className='field-label' htmlFor='msg'>Your message</label>
                <textarea
                  id='msg'
                  ref={taRef}
                  className='textarea'
                  rows={6}
                  placeholder="Be candid. What went well, what didn't, what would you change?"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </div>

              <div className='form-foot'>
                <span className={['char-count', overError && 'error', overWarn && !overError && 'warn'].filter(Boolean).join(' ')}>
                  {len.toLocaleString()} / {MAX.toLocaleString()}
                </span>
                <button
                  type='submit'
                  className='btn btn-primary submit-btn'
                  disabled={!canSubmit || loading}
                >
                  {loading ? 'Sending…' : <span style={{display:'inline-flex',alignItems:'center',gap:8}}>Send feedback <ArrowRightIcon /></span>}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className='success'>
            <div className='success-check'><CheckBigIcon /></div>
            <h2>Sent <em>anonymously.</em></h2>
            <p>Thanks — your message is in the queue. Nothing about who you are was stored.</p>
            <button className='btn btn-ghost' onClick={reset}>Send another</button>
          </div>
        )}
      </div>

      <div className='public-foot'>
        <span>© feedback.box — anonymous by design</span>
        <span
          className='admin-link'
          onClick={() => window.dispatchEvent(new Event('show-admin-login'))}
        >
          <LockIcon /> Admin sign in
        </span>
      </div>
    </div>
  )
}

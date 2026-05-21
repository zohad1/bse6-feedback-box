import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = ['General', 'Bug Report', 'Feature Request', 'Complaint', 'Suggestion']

export default function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('General')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) return
    setLoading(true)
    const { error } = await supabase
      .from('feedback')
      .insert([{ message, category }])
    if (error) {
      alert('Error submitting feedback: ' + error.message)
    } else {
      setSuccess(true)
      setMessage('')
      setCategory('General')
      setTimeout(() => setSuccess(false), 4000)
    }
    setLoading(false)
  }

  return (
    <div className='page'>
      <div className='form-card'>
        <h1>Anonymous Feedback Box</h1>
        <p className='subtitle'>Your feedback is completely anonymous. No account required.</p>
        {success && <div className='success-msg'>Thank you! Your feedback has been submitted.</div>}
        <form onSubmit={handleSubmit}>
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <label>Your Feedback</label>
          <textarea
            rows={5}
            placeholder='Write your feedback here...'
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
        <p className='admin-hint'>
          Are you the admin? <span className='admin-link' onClick={() => window.dispatchEvent(new Event('show-admin-login'))}>Sign in here</span>
        </p>
      </div>
    </div>
  )
}
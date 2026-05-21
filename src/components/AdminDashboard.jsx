import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import FeedbackItem from './FeedbackItem'

const CATEGORIES = ['All', 'General', 'Bug Report', 'Feature Request', 'Complaint', 'Suggestion']

export default function AdminDashboard({ session }) {
  const [feedback, setFeedback] = useState([])
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchFeedback = async () => {
    const { data } = await supabase
      .from('feedback').select('*').order('created_at', { ascending: false })
    setFeedback(data || [])
  }

  useEffect(() => {
    fetchFeedback()
    const channel = supabase.channel('feedback-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'feedback' },
        () => fetchFeedback()
      ).subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  const filtered = feedback.filter(f => {
    const catMatch = categoryFilter === 'All' || f.category === categoryFilter
    const statusMatch = statusFilter === 'all' ? true
      : statusFilter === 'pending' ? !f.is_reviewed : f.is_reviewed
    return catMatch && statusMatch
  })

  const pending = feedback.filter(f => !f.is_reviewed).length
  const reviewed = feedback.filter(f => f.is_reviewed).length

  return (
    <div className='dashboard'>
      <header className='dashboard-header'>
        <div className='dashboard-title'>
          <h1>Feedback Dashboard</h1>
          <p>Manage and review anonymous submissions</p>
        </div>
        <div className='header-right'>
          <span className='admin-email'>{session.user.email}</span>
          <button className='signout-btn' onClick={() => supabase.auth.signOut()}>Sign Out</button>
        </div>
      </header>

      <div className='stats-row'>
        <div className='stat-card'>
          <div className='stat-label'>Total</div>
          <div className='stat-value'>{feedback.length}</div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Pending</div>
          <div className='stat-value'>{pending}</div>
        </div>
        <div className='stat-card'>
          <div className='stat-label'>Reviewed</div>
          <div className='stat-value'>{reviewed}</div>
        </div>
      </div>

      <div className='filters'>
        <div className='filter-group'>
          <label>Category</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className='filter-group'>
          <label>Status</label>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value='all'>All</option>
            <option value='pending'>Pending</option>
            <option value='reviewed'>Reviewed</option>
          </select>
        </div>
        <span className='count'>{filtered.length} item(s)</span>
      </div>

      <div className='feedback-list'>
        {filtered.length === 0
          ? <p className='empty'>No feedback matches your filters.</p>
          : filtered.map(f => <FeedbackItem key={f.id} item={f} onUpdate={fetchFeedback} />)
        }
      </div>
    </div>
  )
}
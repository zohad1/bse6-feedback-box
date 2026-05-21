import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import FeedbackItem from './FeedbackItem'

const CATEGORIES = ['All', 'General', 'Bug Report', 'Feature Request', 'Complaint', 'Suggestion']

const SignOutIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M8.5 4V2.5a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h4.5a1 1 0 0 0 1-1V10M6 7h6.5M10.5 5l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SparkLine = () => (
  <svg className='stat-spark' width='80' height='28' viewBox='0 0 80 28' fill='none'>
    <path d='M2 22 L12 16 L22 19 L32 10 L42 13 L52 6 L62 9 L72 4 L78 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' opacity='0.4'/>
  </svg>
)

export default function AdminDashboard({ session }) {
  const [feedback, setFeedback]         = useState([])
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
    const catMatch    = categoryFilter === 'All' || f.category === categoryFilter
    const statusMatch = statusFilter === 'all' ? true
      : statusFilter === 'pending' ? !f.is_reviewed : f.is_reviewed
    return catMatch && statusMatch
  })

  const total    = feedback.length
  const pending  = feedback.filter(f => !f.is_reviewed).length
  const reviewed = feedback.filter(f => f.is_reviewed).length

  const initials = (session.user.email || 'A').slice(0, 1).toUpperCase()

  return (
    <div>
      <header className='app-header'>
        <div className='app-header-inner'>
          <div className='header-left'>
            <div className='brand'>
              <span className='brand-mark'>f</span>
              <span className='brand-name'>feedback<em> / admin</em></span>
            </div>
            <span className='header-crumbs'>Inbox</span>
          </div>
          <div className='header-right'>
            <span className='admin-pill'>
              <span className='admin-avatar'>{initials}</span>
              {session.user.email}
            </span>
            <button className='btn btn-ghost btn-sm' onClick={() => supabase.auth.signOut()}>
              <SignOutIcon /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className='dashboard'>
        <div className='page-head'>
          <div>
            <h1>Feedback <em>inbox.</em></h1>
            <div className='lede'>Triage submissions, mark them reviewed, keep the queue moving.</div>
          </div>
        </div>

        <div className='stats-row'>
          <div className='stat-card'>
            <div className='stat-label'>Total submissions</div>
            <div className='stat-value'>{total}</div>
            <div className='stat-delta'>all time</div>
            <SparkLine />
          </div>
          <div className='stat-card'>
            <div className='stat-label'>Pending review</div>
            <div className='stat-value'>{pending}</div>
            <div className='stat-delta'>{total > 0 ? Math.round(pending / total * 100) : 0}% of inbox</div>
            <SparkLine />
          </div>
          <div className='stat-card accent'>
            <div className='stat-label'>Reviewed</div>
            <div className='stat-value'>{reviewed}</div>
            <div className='stat-delta'>cleared</div>
            <SparkLine />
          </div>
        </div>

        <div className='filters'>
          <div className='filter-field'>
            <span className='filter-label'>Category</span>
            <select
              className='filter-select'
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className='filter-field'>
            <span className='filter-label'>Status</span>
            <div className='seg' role='tablist'>
              {['all', 'pending', 'reviewed'].map(s => (
                <button
                  key={s}
                  className={statusFilter === s ? 'on' : ''}
                  onClick={() => setStatusFilter(s)}
                >
                  {s[0].toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <span className='filters-grow' />
          <span className='results-count'>
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        <div className='feedback-list'>
          {filtered.length === 0
            ? (
              <div className='empty'>
                <h3>Nothing here</h3>
                <p>No submissions match this filter. Try widening it.</p>
              </div>
            )
            : filtered.map(f => (
              <FeedbackItem key={f.id} item={f} onUpdate={fetchFeedback} />
            ))
          }
        </div>
      </main>
    </div>
  )
}

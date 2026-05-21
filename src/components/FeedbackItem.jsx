import { supabase } from '../lib/supabaseClient'

const CATEGORY_STYLES = {
  'General':         { dot: '#5A5247', bg: '#ECE8E0', text: '#5A5247' },
  'Bug Report':      { dot: '#C2410C', bg: '#FCEBE0', text: '#8B3A20' },
  'Feature Request': { dot: '#3B5BDB', bg: '#E4EAF8', text: '#2A3F7A' },
  'Complaint':       { dot: '#B7791F', bg: '#FAEFD3', text: '#7A5A1A' },
  'Suggestion':      { dot: '#3B6B1F', bg: '#E8EFE0', text: '#3B5A1F' },
}

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7.5L5.5 10.5 11.5 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const RotateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M11.5 6.5A4.5 4.5 0 1 1 7 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M9 1.5L11 3 9.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <path d="M3 4.5h10M6.5 4.5V3.5a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M4.5 4.5l.6 7.5a1.2 1.2 0 0 0 1.2 1.1h3.4a1.2 1.2 0 0 0 1.2-1.1l.6-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const relTime = (ts) => {
  const diff = Math.max(0, Date.now() - new Date(ts).getTime())
  const m = Math.floor(diff / 60_000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7)  return `${d}d ago`
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export default function FeedbackItem({ item, onUpdate }) {
  const toggleReviewed = async () => {
    await supabase.from('feedback').update({ is_reviewed: !item.is_reviewed }).eq('id', item.id)
    onUpdate()
  }

  const deleteItem = async () => {
    if (!window.confirm('Delete this feedback?')) return
    await supabase.from('feedback').delete().eq('id', item.id)
    onUpdate()
  }

  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES['General']

  return (
    <article className={`feedback-item${item.is_reviewed ? ' reviewed' : ''}`}>
      <div>
        <div className='feedback-header'>
          <span className='badge' style={{ background: style.bg, color: style.text }}>
            <span className='badge-dot' style={{ background: style.dot }} />
            {item.category}
          </span>
          {item.is_reviewed
            ? <span className='badge' style={{ background: '#E5ECE6', color: '#1F3D2C' }}>
                <span className='badge-dot' style={{ background: '#1F3D2C' }} />Reviewed
              </span>
            : <span className='badge' style={{ background: '#FAEFD3', color: '#7A5A1A' }}>
                <span className='badge-dot' style={{ background: '#B7791F' }} />Pending
              </span>
          }
          <span className='feed-dot-sep' />
          <span className='feed-time'>{relTime(item.created_at)}</span>
        </div>
        <p className='feedback-message'>{item.message}</p>
      </div>

      <div className='feedback-actions'>
        <button
          className={`toggle-btn${item.is_reviewed ? ' reviewed' : ''}`}
          onClick={toggleReviewed}
          title={item.is_reviewed ? 'Mark as pending' : 'Mark as reviewed'}
        >
          {item.is_reviewed
            ? <><RotateIcon /> Mark pending</>
            : <><CheckIcon /> Mark reviewed</>
          }
        </button>
        <button
          className='icon-btn danger'
          onClick={deleteItem}
          title='Delete'
          aria-label='Delete'
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  )
}

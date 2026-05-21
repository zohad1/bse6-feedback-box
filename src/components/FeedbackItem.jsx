import { supabase } from '../lib/supabaseClient'

export default function FeedbackItem({ item, onUpdate }) {
  const toggleReviewed = async () => {
    await supabase.from('feedback')
      .update({ is_reviewed: !item.is_reviewed })
      .eq('id', item.id)
    onUpdate()
  }

  const deleteItem = async () => {
    if (!window.confirm('Delete this feedback?')) return
    await supabase.from('feedback').delete().eq('id', item.id)
    onUpdate()
  }

  const categoryColors = {
    'General': '#3498db',
    'Bug Report': '#e74c3c',
    'Feature Request': '#9b59b6',
    'Complaint': '#e67e22',
    'Suggestion': '#27ae60'
  }

  return (
    <div className={`feedback-item ${item.is_reviewed ? 'reviewed' : ''}`}>
      <div className='feedback-header'>
        <span className='category-badge' style={{ background: categoryColors[item.category] || '#555' }}>
          {item.category}
        </span>
        <span className='feedback-time'>
          {new Date(item.created_at).toLocaleString()}
        </span>
        <span className={`status-badge ${item.is_reviewed ? 'status-reviewed' : 'status-pending'}`}>
          {item.is_reviewed ? 'Reviewed' : 'Pending'}
        </span>
      </div>
      <p className='feedback-message'>{item.message}</p>
      <div className='feedback-actions'>
        <button className='review-btn' onClick={toggleReviewed}>
          {item.is_reviewed ? 'Mark Pending' : 'Mark Reviewed'}
        </button>
        <button className='delete-btn' onClick={deleteItem}>Delete</button>
      </div>
    </div>
  )
}
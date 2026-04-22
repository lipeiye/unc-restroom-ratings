import { useState } from 'react'
import { Send, User } from 'lucide-react'
import StarRating from './StarRating'
import { TAG_OPTIONS } from '../data/uncRestrooms'

function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) return alert('Please select a rating')
    if (!content.trim()) return alert('Please write a review')

    setIsSubmitting(true)
    try {
      await onSubmit({
        rating,
        content: content.trim(),
        authorName: authorName.trim() || 'Anonymous',
        tags: selectedTags
      })
      setRating(0)
      setContent('')
      setAuthorName('')
      setSelectedTags([])
    } catch (error) {
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
        <StarRating rating={rating} size={28} interactive onRate={setRating} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Name (optional)</label>
        <div className="relative">
          <User size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Anonymous"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-unc-blue focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How was your experience? Clean? Well-stocked? Any issues?"
          rows={4}
          maxLength={500}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-unc-blue focus:border-transparent outline-none transition-all resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{content.length}/500</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.slice(0, 10).map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedTags.includes(tag)
                  ? 'bg-unc-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-unc-blue hover:bg-unc-carolina text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
      >
        <Send size={18} />
        <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
      </button>
    </form>
  )
}

export default ReviewForm

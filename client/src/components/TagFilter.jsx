import { TAG_OPTIONS } from '../data/uncRestrooms'

function TagFilter({ selectedTags, onToggleTag }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAG_OPTIONS.map(tag => {
        const isSelected = selectedTags.includes(tag)
        return (
          <button
            key={tag}
            onClick={() => onToggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              isSelected
                ? 'bg-unc-blue text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-unc-blue hover:text-unc-blue'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}

export default TagFilter

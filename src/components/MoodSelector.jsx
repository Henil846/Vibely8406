import { useState } from 'react';
import { MOODS } from '../utils/constants';
import './MoodSelector.css';

const MoodSelector = ({ selectedMood, onSelect, compact = false }) => {
  const [hoveredMood, setHoveredMood] = useState(null);

  return (
    <div className={`mood-selector ${compact ? 'compact' : ''}`}>
      {!compact && <h3 className="mood-selector-title">How are you feeling?</h3>}
      <div className={`mood-grid ${compact ? 'mood-grid-compact' : ''}`}>
        {MOODS.map(mood => (
          <button
            key={mood.id}
            className={`mood-item ${selectedMood === mood.id ? 'active' : ''}`}
            onClick={() => onSelect(mood.id)}
            onMouseEnter={() => setHoveredMood(mood.id)}
            onMouseLeave={() => setHoveredMood(null)}
            style={{
              '--mood-color': mood.color,
              '--mood-glow': `${mood.color}40`,
            }}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
            {(hoveredMood === mood.id || selectedMood === mood.id) && (
              <div className="mood-glow-effect" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector;

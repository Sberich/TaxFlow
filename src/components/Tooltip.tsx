import { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import './Tooltip.css';

interface Props {
  text: ReactNode;
}

const Tooltip = ({ text }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="tooltip-container" ref={tooltipRef}>
      <button 
        type="button"
        className="tooltip-icon-btn"
        onClick={(e) => { e.preventDefault(); setIsVisible(!isVisible); }}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        aria-label="More information"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </button>
      
      {isVisible && (
        <div className="tooltip-content" onClick={(e) => e.stopPropagation()}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;

import React, { useEffect, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';

interface LyricsLine {
  text: string;
}

interface LyricsListProps {
  lyricsArray: LyricsLine[];
  currentLine: number;
}

const LyricsList: React.FC<LyricsListProps> = ({ lyricsArray, currentLine }) => {
  const activeRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentLine]);

  return (
    <ListGroup variant="flush" className="lyrics-scrollable-list">
      {lyricsArray.length === 0 ? (
        <ListGroup.Item className="lyrics-item text-center text-muted">
          No lyrics found
        </ListGroup.Item>
      ) : (
        lyricsArray.map((line, i) => (
          <ListGroup.Item
            key={i}
            ref={i === currentLine ? activeRef : null}
            active={i === currentLine}
            className={`lyrics-item ${i === currentLine ? 'active' : ''}`}
            onMouseEnter={(e) => {
              if (i !== currentLine) e.currentTarget.classList.add('hover');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.classList.remove('hover');
            }}
            tabIndex={0}
          >
            {line.text}
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  );
};

export default LyricsList;

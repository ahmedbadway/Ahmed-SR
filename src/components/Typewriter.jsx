import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

// Cycles through `words`, typing and deleting each with a blinking caret.
// Under reduced-motion it shows the first word statically (no caret churn).
export default function Typewriter({ words, className = '' }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduce) {
      setText(words[0]);
      return;
    }
    const current = words[index % words.length];
    let delay = deleting ? 45 : 90;

    if (!deleting && text === current) {
      delay = 1600; // hold the full word
    } else if (deleting && text === '') {
      setDeleting(false);
      setIndex((i) => (i + 1) % words.length);
      delay = 240;
    }

    const t = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else {
        const next = deleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1);
        setText(next);
      }
    }, delay);

    return () => clearTimeout(t);
  }, [text, deleting, index, words, reduce]);

  return (
    <span className={className}>
      <span className="text-gradient-gold">{text}</span>
      {!reduce && (
        <span className="ml-0.5 inline-block w-[2px] animate-caret-blink bg-gold align-middle" style={{ height: '1em' }} />
      )}
    </span>
  );
}

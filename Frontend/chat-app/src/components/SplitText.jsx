import React, { useEffect, useState } from 'react';

const SplitText = ({
  text = '',
  className = '',
  delay = 50
}) => {
  const [visible, setVisible] = useState(false);
  const letters = text.split('');

  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 0.5s ease, transform 0.5s ease`,
            transitionDelay: `${index * delay}ms`
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
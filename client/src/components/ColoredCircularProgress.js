import React, { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

function ColoredCircularProgress({ value }) {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    let animationFrameId;

    const animate = () => {
      setAnimatedValue((prevValue) => Math.min(prevValue + 1, value));
      if (animatedValue < value) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (animatedValue < value) {
      animate();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [animatedValue, value]);

  const getColor = () => {
    if (value >= 0 && value <= 25) {
      return 'red';
    } else if (value > 25 && value <= 50) {
      return 'orange';
    } else if (value > 50 && value <= 75) {
      return 'yellow';
    } else if (value > 75 && value <= 100) {
      return 'blue';
    } else {
      return 'blue';
    }
  };

  return (
    <CircularProgress
      variant="determinate"
      value={(animatedValue / 100) * 100}
      size={120}
      sx={{ color: getColor() }}
    />
  );
}

export default ColoredCircularProgress;

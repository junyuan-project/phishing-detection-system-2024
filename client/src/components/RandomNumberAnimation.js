import React, { useState, useEffect } from 'react';
import { useSpring, animated, config } from 'react-spring';

const RandomNumberAnimation = ({ finalValue }) => {
  const [randomNumber, setRandomNumber] = useState(0);

  const { number } = useSpring({
    from: { number: 0 },
    to: { number: finalValue },
    config: config.molasses, 
  });

  useEffect(() => {
    setRandomNumber(finalValue);
  }, [finalValue]);

  return <animated.div>{number.to((val) => Math.ceil(val))}</animated.div>;
};

export default RandomNumberAnimation;

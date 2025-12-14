import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for animating number count-up effect
 * @param {number} end - Target number to count up to
 * @param {number} duration - Animation duration in milliseconds (default: 1000)
 * @param {number} start - Starting number (default: 0)
 * @param {function} easingFn - Easing function (default: easeOutQuad)
 * @returns {number} - Current animated value
 */
const useCountUp = (end, duration = 1000, start = 0, easingFn = null) => {
  const [count, setCount] = useState(start);
  const frameRef = useRef();
  const startTimeRef = useRef();

  // Default easing function (ease-out quadratic)
  const easeOutQuad = (t) => t * (2 - t);

  useEffect(() => {
    const easing = easingFn || easeOutQuad;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easedProgress = easing(progress);
      const currentCount = start + (end - start) * easedProgress;

      setCount(currentCount);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end); // Ensure we end at exact value
      }
    };

    // Reset start time when end value changes
    startTimeRef.current = null;
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, start, easingFn]);

  return count;
};

export default useCountUp;

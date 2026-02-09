import React, { useEffect, useState, useRef } from 'react';
import { useInView } from 'framer-motion';

export interface CountUpProps {
  end: number | string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  enableScrollSpy?: boolean;
  scrollSpyOnce?: boolean;
}

const CountUp: React.FC<CountUpProps> = ({
  end,
  duration = 2,
  prefix = '',
  suffix = '',
  enableScrollSpy = false,
  scrollSpyOnce = true,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: scrollSpyOnce, amount: 0.5 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const startAnimation = (): (() => void) | undefined => {
      if (hasAnimated && scrollSpyOnce) return;

      let start = 0;
      const endValue = parseInt(String(end), 10);
      if (isNaN(endValue)) return;

      const incrementTime = (duration * 1000) / endValue;

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === endValue) {
          clearInterval(timer);
          setHasAnimated(true);
        }
      }, incrementTime > 0 ? incrementTime : 1);

      return () => clearInterval(timer);
    };

    if (enableScrollSpy) {
      if (isInView) {
        startAnimation();
      }
    } else {
      startAnimation();
    }
  }, [end, duration, isInView, enableScrollSpy, scrollSpyOnce, hasAnimated]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

export default CountUp;

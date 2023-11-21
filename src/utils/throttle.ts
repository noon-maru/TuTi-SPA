const throttle = <T extends (...args: any[]) => void>(func: T, ms: number) => {
  let throttled = false;
  return (...args: Parameters<T>) => {
    if (!throttled) {
      throttled = true;
      setTimeout(() => {
        func(...args);
        throttled = false;
      }, ms);
    }
  };
};

export default throttle;

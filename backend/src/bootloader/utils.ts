export function timify<T>(promise: Promise<T>, ms: number) {
  return () => {
    const timer = new Promise((_resolve, reject) => setTimeout(reject, ms));
    return Promise.race([promise, timer]);
  };
}

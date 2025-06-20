export function throttle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (...args: Parameters<T>) {
    if (timeout) return
    timeout = setTimeout(() => {
      fn(...args)
      timeout = null
    }, delay)
  }
}

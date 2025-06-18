export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): T {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function (this: any, ...args: any[]) {
    if (timeout) return
    timeout = setTimeout(() => {
      fn.apply(this, args)
      timeout = null
    }, delay)
  } as T
}

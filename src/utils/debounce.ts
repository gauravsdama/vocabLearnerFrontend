export type Debounced<T extends (...args: never[]) => void> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};

export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  wait = 100,
): Debounced<T> {
  let timeout: number | undefined;

  const debounced = (...args: Parameters<T>) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), wait);
  };

  debounced.cancel = () => {
    window.clearTimeout(timeout);
  };

  return debounced;
}

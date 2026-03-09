export type Producer<T, A = void> = A extends unknown ? (args: A) => T : () => T

import type { Producer } from './types'

/**
 * Creates a new array in a human-friendly way
 *
 * @param length
 * @param init
 */
export function create<T>(length: number, init: Producer<T, number>): T[]
export function create<T>(length?: number, init?: T): T[]
export function create<T>(length = 0, init?: T | Producer<T, number>): T[] {
	if (typeof init === 'function') {
		return Array.from({ length }, (_, i) => (init as Producer<T, number>)(i))
	}

	if (init === undefined) init = 0 as T

	return Array.from({ length }, () => init)
}

/**
 * Performs symmetric difference between two iterables
 *
 */
export function xor<T>(values: Iterable<T>, toggles: Iterable<T>): T[] {
	const set = new Set(values)
	for (const value of toggles) {
		set.has(value) ? set.delete(value) : set.add(value)
	}
	return [...set]
}

/**
 * Returns a new shuffled array of elements
 *
 * @param arr
 * @returns
 */
export function shuffle<T>(arr: T[]): T[] {
	const result = [...arr]

	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[result[i], result[j]] = [result[j], result[i]]
	}

	return result
}

/**
 * Searches an array for duplicated value, returns an array of them
 *
 * @param arr
 * @returns
 */
export function duplicates<T>(arr: T[]): T[] {
	const set = new Set<T>()
	const result = new Set<T>()
	for (const val of arr) {
		set.has(val) ? result.add(val) : set.add(val)
	}
	return [...result]
}

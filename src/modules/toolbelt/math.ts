type Range = number[]

export function range(from: number, to?: number, step: number = 1): Range {
	if (!to) [from, to] = [0, from]

	const result = []

	for (let i = from; i < to; i += step) {
		result.push(i)
	}

	return result
}

/**
 *
 * @example
 *   clamp(10, 20, 100);
 *
 *   const span: Span = [20, 100];
 *   clamp(10, ...span);
 *
 * @param value
 * @param min
 * @param max
 * @returns number
 */
export function clamp(value: number, min: number, max: number): number {
	return Math.max(Math.min(value, max), min)
}

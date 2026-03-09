import { d2 } from '@/toolbelt'

import { BOX_SIZE } from './constants'

/**
 * Iterates over all units: all rows, all columns, and all rects
 */
export function* units<T>(arr: d2.Array<T>) {
	for (const val of d2.rows(arr)) {
		yield val
	}

	for (const val of d2.columns(arr)) {
		yield val
	}

	for (const val of d2.rects(arr, 3)) {
		yield val
	}
}

/**
 * Iterates over cell neighbors: its row, its column, and its rect
 */
export function* neighbors<T>(arr: d2.Array<T>, pos: d2.Position) {
	for (const val of d2.row(arr, pos[1])) {
		yield val
	}

	for (const val of d2.column(arr, pos[0])) {
		yield val
	}

	const [x, y] = [Math.floor(pos[0] / BOX_SIZE), Math.floor(pos[1] / BOX_SIZE)]

	for (const val of d2.rect(arr, [x * BOX_SIZE, y * BOX_SIZE, BOX_SIZE, BOX_SIZE])) {
		yield val
	}
}

export function flattenIndex(x: number, y: number, size = BOX_SIZE) {
	return Math.floor(x / size) * 10 + Math.floor(y / size)
}

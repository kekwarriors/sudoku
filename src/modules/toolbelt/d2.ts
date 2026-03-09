import * as array from './array'

export type Array<T> = T[][]
export type Position = [x: number, y: number]
export type Size = [width: number, height: number]
export type Rect = [...Position, ...Size]

// -- Creation -----------------------------------------------------------------

// Better to use `Uint*Array` for drawing
export function create<T = number>(width: number, height?: number, init: () => T = () => 0 as T): Array<T> {
	if (width < 1) throw new Error('Wrong array size')
	if (!height) height = width

	return array.create(height, () => array.create(width, init)) as Array<T>
}

// -- Getters ------------------------------------------------------------------

export function get<T>(arr: Array<T>, [x, y]: Position): T {
	return arr[y][x]
}

// -- Setters ------------------------------------------------------------------

export function set<T>(arr: Array<T>, [x, y]: Position, val: T): void
export function set<T>(arr: Array<T>, [x, y]: Position, val: (arg: T) => T): void
export function set<T>(arr: Array<T>, [x, y]: Position, val: T | ((arg: T) => T)): void {
	arr[y][x] = typeof val === 'function' ? (val as (arg: T) => T)(arr[y][x]) : val
}

// -- Iterators ----------------------------------------------------------------

interface RectIterator<T> {
	[Symbol.iterator](): Generator<[T, Position], void, unknown>
}

export function* rect<T>(arr: Array<T>, [rx, ry, rw, rh]: Rect): RectIterator<T> {
	for (let y = ry; y < ry + rh; y++) {
		for (let x = rx; x < rx + rw; x++) {
			yield [arr[y][x], [x, y]] as const
		}
	}
}

interface RowIterator<T> {
	[Symbol.iterator](): Generator<[T, Position], void, unknown>
}

export function* row<T>(arr: Array<T>, y: number): RowIterator<T> {
	for (let x = 0; x < arr[y].length; x++) {
		yield [arr[y][x], [x, y]] as const
	}
}

interface ColumnIterator<T> {
	[Symbol.iterator](): Generator<[T, Position], void, unknown>
}

export function* column<T>(arr: Array<T>, x: number): ColumnIterator<T> {
	for (let y = 0; y < arr[x].length; y++) {
		yield [arr[y][x], [x, y]] as const
	}
}

export function* rows<T>(arr: Array<T>) {
	for (let y = 0; y < arr.length; y++) {
		yield [arr[y], y] as const
	}
}

export function* columns<T>(arr: Array<T>) {
	for (let x = 0; x < arr[0].length; x++) {
		const col = []

		for (let y = 0; y < arr.length; y++) {
			col.push(arr[y][x])
		}

		yield [col, x] as const
	}
}

export function* rects<T>(arr: Array<T>, size: number) {
	const gridSize = arr.length
	const rectsPerRow = gridSize / size

	for (let i = 0; i < rectsPerRow * rectsPerRow; i++) {
		const y = Math.floor(i / rectsPerRow) * size
		const x = (i % rectsPerRow) * size
		const rect = arr.slice(y, y + size).flatMap((row) => row.slice(x, x + size))

		yield [rect, x, y] as const
	}
}

// -- Predicates ---------------------------------------------------------------

export function isSameRect([x1, y1]: Position, [x2, y2]: Position, size: number) {
	return Math.floor(x1 / size) === Math.floor(x2 / size) && Math.floor(y1 / size) === Math.floor(y2 / size)
}

export function equal([x1, y1]: Position, [x2, y2]: Position): boolean {
	return x1 === x2 && y1 === y2
}

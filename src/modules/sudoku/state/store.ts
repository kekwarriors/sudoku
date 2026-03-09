import { create } from 'mutative'
import { createStore } from '@xstate/store'

import { array, d2, math } from '@/toolbelt'

import { GRID_SIZE } from '../logic/constants'
import { flattenIndex, neighbors } from '../logic/logic'
import { generate } from '../api/generator'

type Mode = 'numbers' | 'hints'

interface SudokuContext {
	start: d2.Array<number>
	board: d2.Array<number>
	hints: d2.Array<number[]>
	selected: d2.Position
	mode: Mode
	debug: boolean

	shouldColorNumbers: boolean
	shouldDimNumbers: boolean
}

const initial = generate()

const context: SudokuContext = {
	start: [...initial],
	board: [...initial],
	hints: d2.create<number[]>(9, 9, () => []),
	selected: [4, 4],
	mode: 'numbers',
	debug: false,
	shouldColorNumbers: true,
	shouldDimNumbers: false,
}

export const store = createStore({
	context,
	on: {
		setNewBoard: (ctx) => {
			return create(ctx, (d) => {
				const board = generate()

				d.start = board
				d.board = board
				d.hints = d2.create(9, 9, () => [])
			})
		},

		setMode: (ctx, evt: { mode: Mode }) => {
			return create(ctx, (d) => {
				d.mode = evt.mode
			})
		},

		reset: (ctx) => {
			return create(ctx, (d) => {
				d.board = d.start
			})
		},

		select: (ctx, evt: { pos: d2.Position }) => {
			return create(ctx, (d) => {
				d.selected = [math.clamp(evt.pos[0], 0, GRID_SIZE - 1), math.clamp(evt.pos[1], 0, GRID_SIZE - 1)]
			})
		},

		setValue: (ctx, evt: { number: number }, enqueue) => {
			// todo: enqueue.emit('check')

			return create(ctx, (d) => {
				if (d2.get(d.start, ctx.selected) !== 0) {
					return
				}

				const cur = d2.get(d.board, ctx.selected)

				d2.set(d.board, ctx.selected, cur === evt.number ? 0 : evt.number)

				// remove all hints in the cell...
				d2.set(d.hints, ctx.selected, [])

				// ...and same value hints in corresponding neighbor structures
				for (const [hints, pos] of neighbors(d.hints, ctx.selected)) {
					const filtered = hints.filter((_) => _ != evt.number)

					d2.set(d.hints, pos, filtered)
				}
			})
		},

		setHint: (ctx, evt: { number: number }) => {
			if (d2.get(ctx.start, ctx.selected) !== 0) return

			if (d2.get(ctx.board, ctx.selected) !== 0) return

			return create(ctx, (d) => {
				d2.set(d.hints, d.selected, (val) => array.xor(val, [evt.number]))
			})
		},

		toggleColoredNumbers: (ctx) => {
			return create(ctx, (d) => {
				d.shouldColorNumbers = !d.shouldColorNumbers
			})
		},
		toggleDimmedNumbers: (ctx) => {
			return create(ctx, (d) => {
				d.shouldDimNumbers = !d.shouldDimNumbers
			})
		},
	},
})

export const errors = store.select((state) => {
	const errors: Record<'rows' | 'cols' | 'rects', Record<number, number[]>> = {
		rows: {},
		cols: {},
		rects: {},
	}

	for (const [row, y] of d2.rows(state.board)) {
		const duplicates = array.duplicates(row).filter((_) => _ !== 0)

		if (duplicates.length) {
			errors.rows[y] = duplicates
		}
	}
	for (const [col, x] of d2.columns(state.board)) {
		const duplicates = array.duplicates(col).filter((_) => _ !== 0)

		if (duplicates.length) {
			errors.cols[x] = duplicates
		}
	}

	for (const [rect, col, row] of d2.rects(state.board, 3)) {
		const duplicates = array.duplicates(rect).filter((_) => _ !== 0)

		if (duplicates.length) {
			errors.rects[flattenIndex(col, row)] = duplicates
		}
	}

	return errors
})

export function hasError(val: number, pos: d2.Position) {
	const { cols, rows, rects } = errors.get()

	return cols[pos[0]]?.includes(val) || rows[pos[1]]?.includes(val) || rects[flattenIndex(...pos)]?.includes(val)
}

// todo: more efficient?
export function hasHintError(val: number, pos: d2.Position) {
	const { board } = store.get().context

	for (const [v] of neighbors(board, pos)) {
		if (v === val) return true
	}

	return false
}

export function isInitial(pos: d2.Position) {
	const { start } = store.get().context

	return d2.get(start, pos) != 0
}

export function isNeighbor(pos: d2.Position) {
	const { selected } = store.get().context

	return selected[0] === pos[0] || selected[1] === pos[1] || d2.isSameRect(selected, pos, 3)
}

export function hasSameValue(val: number) {
	const { board, selected } = store.get().context

	if (val === 0) return false

	return val === d2.get(board, selected)
}

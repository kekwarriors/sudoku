import { array, d2, math } from '@/toolbelt'

export function generate() {
	const board = d2.create(9)

	fill(board)

	removeCells(board)

	return board
}

function fill(board: d2.Array<number>) {
	const diagonals: d2.Rect[] = [
		[0, 0, 3, 3],
		[3, 3, 3, 3],
		[6, 6, 3, 3],
	] as const

	for (const rect of diagonals) {
		const numbers = array.shuffle(math.range(1, 10))

		for (let [_, [x, y]] of d2.rect(board, rect)) {
			board[y][x] = numbers.pop()!
		}
	}

	fillCell(board)
}

function isValid(board: d2.Array<number>, [x, y]: d2.Position, n: number) {
	for (let i = 0; i < 9; i++) {
		if (board[y][i] === n) return false
		if (board[i][x] === n) return false
	}

	const by = Math.floor(y / 3) * 3
	const bx = Math.floor(x / 3) * 3

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (board[by + i][bx + j] === n) return false
		}
	}

	return true
}

function fillCell(board: d2.Array<number>, [x, y]: d2.Position = [0, 0]) {
	if (y === 9) return true

	if (x === 9) return fillCell(board, [0, y + 1])

	// skip already filled diagonal boxes
	if (board[y][x] !== 0) return fillCell(board, [x + 1, y])

	const numbers = array.shuffle(math.range(1, 10))

	for (const n of numbers) {
		if (isValid(board, [x, y], n)) {
			board[y][x] = n

			if (fillCell(board, [x + 1, y])) return true

			board[y][x] = 0
		}
	}

	return false
}

function countSolutions(board: d2.Array<number>, limit = 2) {
	let count = 0

	function solve(cells: Array<[number, number]>, index: number): void {
		if (count >= limit) return

		if (index === cells.length) {
			count++
			return
		}

		const [x, y] = cells[index]

		for (let n = 1; n <= 9; n++) {
			if (isValid(board, [x, y], n)) {
				board[y][x] = n
				solve(cells, index + 1)
				board[y][x] = 0
			}
		}
	}

	const emptyCells: Array<[number, number]> = []
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			if (board[y][x] === 0) {
				emptyCells.push([x, y])
			}
		}
	}

	solve(emptyCells, 0)

	return count
}

function removeCells(board: d2.Array<number>) {
	const positions = []

	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			positions.push([x, y])
		}
	}

	const shuffled = array.shuffle(positions)

	for (const [x, y] of shuffled) {
		const backup = board[y][x]

		board[y][x] = 0

		const sy = 8 - y
		const sx = 8 - x
		const symBackup = board[sy][sx]

		board[sy][sx] = 0
		const clueCount = countClues(board)

		const solutions = countSolutions(board)

		if (clueCount < 25 || solutions !== 1) {
			board[y][x] = backup
			board[sy][sx] = symBackup
		}
	}
}

function countClues(board: d2.Array<number>): number {
	let count = 0
	for (let i = 0; i < 9; i++) {
		for (let j = 0; j < 9; j++) {
			if (board[i][j] !== 0) count++
		}
	}
	return count
}

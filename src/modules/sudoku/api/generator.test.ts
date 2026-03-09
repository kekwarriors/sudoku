import { describe, it } from 'vitest'

import { generate } from './generator'

describe('generator', () => {
	it('should generate', () => {
		const board = generate()

		console.log(board.map((_) => _.join('')).join('\n'))
	})
})

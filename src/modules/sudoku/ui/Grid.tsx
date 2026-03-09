import clsx from 'clsx'
import { useSelector } from '@xstate/store-preact'
import { store } from '../state/store'
import { Cell } from './Cell'

export function Grid() {
	const board = useSelector(store, (_) => _.context.board)

	return (
		<table className="table-auto w-[600px] h-[600px]">
			<tbody>
				{board.map((row, y) => (
					<tr className={clsx('row')} key={y}>
						{row.map((val, x) => (
							<Cell key={x} val={val} pos={[x, y]} />
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

import clsx from 'clsx'
import { useSelector } from '@xstate/store-preact'
import { d2 } from '@/toolbelt'
import { hasError, isInitial, isNeighbor, hasSameValue, store, hasHintError } from '../state/store'

import './Cell.css'

interface Props {
	val: number
	pos: d2.Position
}

export function Cell({ val, pos }: Props) {
	const shouldColorNumbers = useSelector(store, (_) => _.context.shouldColorNumbers)
	const shouldDimNumbers = useSelector(store, (_) => _.context.shouldDimNumbers)
	const selected = useSelector(store, (_) => _.context.selected)
	const mode = useSelector(store, (_) => _.context.mode)
	const hints = useSelector(store, (_) => d2.get(_.context.hints, pos))

	return (
		<td
			data-number={val}
			className={clsx('cell hover:outline hover:outline-dashed hover:-outline-offset-4 hover:outline-gray-300', {
				sameValue: hasSameValue(val),
				startValue: isInitial(pos),
				neighbor: isNeighbor(pos),
				invalidValue: hasError(val, pos),
				selected: d2.equal(selected, pos),
				'mode-numbers': mode === 'numbers',
				'mode-hints': mode === 'hints',
				colored: shouldColorNumbers,
				dimmed: shouldDimNumbers && !hasSameValue(val),
			})}
			onClick={() => store.trigger.select({ pos })}
		>
			{val !== 0 && val}
			<ul className="hints">
				{hints.map((hint) => (
					<li
						data-number={hint}
						key={hint}
						className={clsx({
							invalidValue: hasHintError(hint, pos),
							colored: shouldColorNumbers,
							dimmed: shouldDimNumbers && !hasSameValue(hint),
						})}
					>
						{hint}
					</li>
				))}
			</ul>
		</td>
	)
}

import clsx from 'clsx'
import { useSelector } from '@xstate/store-preact'
import { store } from '../state/store'
import { ui } from '../../ui'

export function Mode() {
	const mode = useSelector(store, (_) => _.context.mode)

	return (
		<div className="flex gap-4 justify-center items-center mt-4">
			<span className="text-gray-400">
				Mode
				<ui.Kbd>Space</ui.Kbd>
			</span>
			<button
				className={clsx('align-baseline rounded px-2 py-1', {
					'bg-sky-100': mode === 'numbers',
				})}
				onClick={() => store.trigger.setMode({ mode: 'numbers' })}
			>
				Numbers
				<ui.Kbd>N</ui.Kbd>
			</button>
			<button
				className={clsx('align-baseline rounded px-2 py-1', {
					'bg-amber-100': mode === 'hints',
				})}
				onClick={() => store.trigger.setMode({ mode: 'hints' })}
			>
				Hints
				<ui.Kbd>H</ui.Kbd>
			</button>
		</div>
	)
}

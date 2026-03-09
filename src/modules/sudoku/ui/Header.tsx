import { useSelector } from '@xstate/store-preact'
import { store } from '../state/store'
import { ui } from '../../ui'

export function Header() {
	const shouldDimNumbers = useSelector(store, (_) => _.context.shouldDimNumbers)
	const shouldColorNumbers = useSelector(store, (_) => _.context.shouldColorNumbers)

	return (
		<div class="mb-4 flex gap-8 justify-center">
			<button class="bg-gray-50 px-2 rounded border border-gray-100" onClick={() => store.trigger.setNewBoard()}>
				Start new game
			</button>

			<ui.Checkbox checked={shouldColorNumbers} onChange={store.trigger.toggleColoredNumbers}>
				Colorful numbers
			</ui.Checkbox>
			<ui.Checkbox checked={shouldDimNumbers} onChange={store.trigger.toggleDimmedNumbers}>
				Dim other numbers
			</ui.Checkbox>
		</div>
	)
}

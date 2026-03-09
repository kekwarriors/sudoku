import { useEffect } from 'preact/compat'
import { store } from '../state/store'

export function useKeyboard() {
	function handleKeyboardEvent(e: KeyboardEvent) {
		console.log(e.code)

		if (e.code === 'Space') {
			store.trigger.setMode({ mode: store.get().context.mode === 'numbers' ? 'hints' : 'numbers' })
		}
		if (e.code === 'KeyN') {
			store.trigger.setMode({ mode: 'numbers' })
		}

		if (e.code === 'KeyH') {
			store.trigger.setMode({ mode: 'hints' })
		}

		if (e.code.match(/(Numpad|Digit)[0-9]/)) {
			const state = store.get()

			if (state.context.mode === 'numbers') {
				store.trigger.setValue({ number: parseInt(e.code.replace(/\D/g, '')) })
			}

			if (state.context.mode === 'hints') {
				store.trigger.setHint({ number: parseInt(e.code.replace(/\D/g, '')) })
			}
		}

		if (e.code.startsWith('Arrow') || ['KeyW', 'KeyA', 'KeyS', 'KeyD'].includes(e.code)) {
			const selected = store.get().context.selected

			if (!selected) return

			const [x, y] = selected

			switch (e.code) {
				case 'ArrowUp':
				case 'KeyW':
					return store.trigger.select({ pos: [x, y - 1] })
				case 'ArrowDown':
				case 'KeyS':
					return store.trigger.select({ pos: [x, y + 1] })
				case 'ArrowLeft':
				case 'KeyA':
					return store.trigger.select({ pos: [x - 1, y] })
				case 'ArrowRight':
				case 'KeyD':
					return store.trigger.select({ pos: [x + 1, y] })
			}
		}

		if (['Numpad0', 'Digit0', 'Delete'].includes(e.code)) {
			store.trigger.setValue({ number: 0 })
		}
	}

	useEffect(() => {
		document.addEventListener('keydown', handleKeyboardEvent)

		return () => document.removeEventListener('keydown', handleKeyboardEvent)
	}, [])
}

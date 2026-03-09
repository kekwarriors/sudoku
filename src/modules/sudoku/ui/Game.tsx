import { Errors } from './Errors'
import { Grid } from './Grid'
import { Header } from './Header'
import { Mode } from './Mode'
import { Numbers } from './Numbers'
import { useKeyboard } from './useKeyboard'

export function Game() {
	useKeyboard()

	return (
		<div className="flex m-8 gap-8 justify-center">
			<div className="flex flex-col">
				<Header />
				<Numbers />
				<Grid />
				<Mode />
			</div>
			<Errors />
		</div>
	)
}

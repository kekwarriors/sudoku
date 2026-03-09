import { useSelector } from '@xstate/store-preact'
import { errors, store } from '../state/store'

export function Errors() {
	const _errors = useSelector(errors)
	const debug = useSelector(store, (_) => _.context.debug)

	if (!debug) {
		return null
	}

	return (
		<div>
			Errors
			<pre>{JSON.stringify(_errors, null, 2)}</pre>
		</div>
	)
}

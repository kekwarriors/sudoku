import { numbers } from '../logic/constants'
import { store } from '../state/store'

export function Numbers() {
	return (
		<table class="table-fixed text-center w-[600px] mb-4">
			<tbody>
				<tr>
					{numbers.map((number) => (
						<td key={number} onClick={() => store.trigger.setValue({ number: Number(number) })}>
							<button class="w-10 h-10 bg-gray-100 border border-gray-200 rounded hover:cursor-pointer">
								{number}
							</button>
						</td>
					))}
				</tr>
			</tbody>
		</table>
	)
}

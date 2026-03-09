import type { InputHTMLAttributes, ComponentChildren } from 'preact'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	children: ComponentChildren
}

export function Checkbox({ children, ...rest }: Props) {
	return (
		<label class="flex gap-2 bg-gray-50 px-2 rounded border border-gray-100">
			{children}
			<input type="checkbox" {...rest} />
		</label>
	)
}

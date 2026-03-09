import type { ComponentChildren } from 'preact'

export function Kbd(props: { children: ComponentChildren }) {
	return <span className="m-2 border px-1 rounded text-sm">{props.children}</span>
}

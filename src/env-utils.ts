export function isAMD() {
	const _window = window as any
	const _require = _window.requirejs || _window.require

	return (
		typeof _require === 'function' &&
		typeof _window.define === 'function' &&
		!!_window.define.amd
	)
}

export function isES() {
	return 'noModule' in HTMLScriptElement.prototype
}

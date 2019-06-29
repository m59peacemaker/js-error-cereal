const coreErrorConstructors = {
	Error,
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError
}

module.exports = (value, { customErrorConstructors = {} } = {})  => {
	const errorName = value.name || 'Error'
	const errorConstructors = { ...coreErrorConstructors, ...customErrorConstructors }
	const errorConstructor = errorConstructors[errorName]
	return Object.assign(new errorConstructor(value.message), value)
}

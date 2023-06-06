const core_error_constructors = {
	Error,
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError
}

export const deserialize_error = (value, { custom_error_constructors = {} } = {})  => {
	const error_name = value.name || 'Error'
	const error_constructors = { ...core_error_constructors, ...custom_error_constructors }
	const error_constructor = error_constructors[error_name]
	return Object.assign(new error_constructor(value.message), value)
}

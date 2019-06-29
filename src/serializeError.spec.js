const { test } = require('zora')
const pick = require('./util/pick')
const serializeError = require('./serializeError')

test('serializeError', t => {
	const error = new Error('very intense error')
	t.equal(
		Object.keys(error),
		[],
		'sanity check - error object has no keys'
	)
	t.equal(
		Object.keys(serializeError(error)),
		[ 'name', 'message', 'stack' ],
		'serialized error has { name, message, stack }'
	)
	t.equal(
		pick([ 'name', 'message' ], serializeError(error)),
		{ name: 'Error', message: 'very intense error' }
	)
	t.doesNotThrow(
		() => JSON.stringify(serializeError(error)),
		'can json stringify serialized error'
	)
	t.equal(
		JSON.stringify(error),
		'{}',
		`sanity check - json stringifying error results in '{}'`
	)
	t.notEqual(
		JSON.stringify(serializeError(error)),
		'{}',
		`json stringifying serialized error does not result in '{}'`
	)
	const extraData = { foo: { bar: 'baz' } }
	extraData.foo.circular = extraData
	t.equal(
		pick(
			[ 'name', 'message', 'foo' ],
			serializeError(Object.assign(new Error('detailed error'), extraData))
		),
		{
			name: 'Error',
			message: 'detailed error',
			foo: { bar: 'baz', circular: { foo: '[Circular]' } }
		},
		`keeps nested values and converts circular references to '[Circular]'`
	)
})

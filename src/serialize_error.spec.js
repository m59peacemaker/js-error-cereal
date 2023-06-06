import { test } from 'zora'
import { pick } from './util/pick.js'
import { serialize_error } from './serialize_error.js'

test('serialize_error', t => {
	const error = new Error('very intense error')
	t.equal(
		Object.keys(error),
		[],
		'sanity check - error object has no keys'
	)
	t.equal(
		Object.keys(serialize_error(error)),
		[ 'name', 'message', 'stack' ],
		'serialized error has { name, message, stack }'
	)
	t.equal(
		pick([ 'name', 'message' ], serialize_error(error)),
		{ name: 'Error', message: 'very intense error' }
	)
	t.doesNotThrow(
		() => JSON.stringify(serialize_error(error)),
		'can json stringify serialized error'
	)
	t.equal(
		JSON.stringify(error),
		'{}',
		`sanity check - json stringifying error results in '{}'`
	)
	t.notEqual(
		JSON.stringify(serialize_error(error)),
		'{}',
		`json stringifying serialized error does not result in '{}'`
	)
	const extra_data = { foo: { bar: 'baz' } }
	extra_data.foo.circular = extra_data
	t.equal(
		pick(
			[ 'name', 'message', 'foo' ],
			serialize_error(Object.assign(new Error('detailed error'), extra_data))
		),
		{
			name: 'Error',
			message: 'detailed error',
			foo: { bar: 'baz', circular: { foo: '[Circular]' } }
		},
		`keeps nested values and converts circular references to '[Circular]'`
	)
})

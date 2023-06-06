import { test } from 'zora'
import { serialize_error } from './serialize_error.js'
import { deserialize_error } from './deserialize_error.js'
import { pick } from './util/pick.js'

test('deserialize_error', t => {
	t.ok(
		deserialize_error({ }) instanceof Error,
		'takes an object and returns an error'
	)
	t.equal(
		deserialize_error({ name: 'SyntaxError' }).constructor,
		SyntaxError,
		'uses constructor from { name }'
	)
	t.throws(
		() => deserialize_error({ name: 'UnfathomableError' }),
		'throws when { name } refers to unknown constructor'
	)

	class UnfathomableError extends Error {
		constructor (message) {
			super(message)
			this.name = 'UnfathomableError'
		}
	}
	t.ok(
		deserialize_error(
			{ name: 'UnfathomableError' },
			{
				custom_error_constructors: {
					UnfathomableError
				}
			}
		) instanceof UnfathomableError,
		'uses custom_error_constructors'
	)

	t.equal(
		deserialize_error({
			name: 'Error',
			foo: {
				bar: {
					baz: 123
				}
			}
		}).foo.bar,
		{ baz: 123 },
		'deserialize error is given nested properties from serialized error'
	)
	t.equal(
		pick(
			[ 'name', 'message', 'foo' ],
			serialize_error(deserialize_error({
				name: 'Error',
				message: 'an error',
				foo: { bar: { baz: 123 } }
			}))
		),
		{
			name: 'Error',
			message: 'an error',
			foo: { bar: { baz: 123 } }
		},
		'deserialize_error is isomorphic-ish with serialize_error (i.e. non-circular values)'
	)
})

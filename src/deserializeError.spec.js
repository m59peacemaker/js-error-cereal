const { test } = require('zora')
const serializeError = require('./serializeError')
const deserializeError = require('./deserializeError')
const pick = require('./util/pick')

test('deserializeError', t => {
	t.ok(
		deserializeError({ }) instanceof Error,
		'takes an object and returns an error'
	)
	t.equal(
		deserializeError({ name: 'SyntaxError' }).constructor,
		SyntaxError,
		'uses constructor from { name }'
	)
	t.throws(
		() => deserializeError({ name: 'UnfathomableError' }),
		'throws when { name } refers to unknown constructor'
	)

	class UnfathomableError extends Error {
		constructor (message) {
			super(message)
			this.name = 'UnfathomableError'
		}
	}
	t.ok(
		deserializeError(
			{ name: 'UnfathomableError' },
			{
				customErrorConstructors: {
					UnfathomableError
				}
			}
		) instanceof UnfathomableError,
		'uses customErrorConstructors'
	)

	t.equal(
		deserializeError({
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
			serializeError(deserializeError({
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
		'deserializeError is isomorphic-ish with serializeError (i.e. non-circular values)'
	)
})

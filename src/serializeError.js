const pick = require('./util/pick')

const errorCommonProperties = [
	'name',
	'message',
	'stack',
	'code'
]

const hasToJSON = value => value != null && typeof value.toJSON === 'function'
const shouldInclude = value => typeof value !== 'function' || hasToJSON(value)

const serializeObject = (object, references) => Object
	.entries(object)
	.reduce(
		({ acc, references }, [ k, v ]) => {
			if (shouldInclude(v)) {
				acc[k] = hasToJSON(v)
					? v.toJSON()
					: typeof v === 'object' && v != null
						? (references.includes(v)
							? '[Circular]'
							: serializeObject(v, references)
						)
						: v
			}
			return { acc, references }
		},
		{
			acc: Object.assign(
				Array.isArray(object) ? [] : Object.create(null),
				pick(errorCommonProperties, object)
			),
			references: references.concat(object)
		}
	)
	.acc

module.exports = value => serializeObject(value, [ ])

import { pick } from './util/pick.js'

const error_common_properties = [
	'name',
	'message',
	'stack',
	'code'
]

const has_to_JSON = value => value != null && typeof value.toJSON === 'function'
const should_include = value => typeof value !== 'function' || has_to_JSON(value)

const serialize_object = (object, references) => Object
	.entries(object)
	.reduce(
		({ acc, references }, [ k, v ]) => {
			if (should_include(v)) {
				acc[k] = has_to_JSON(v)
					? v.toJSON()
					: typeof v === 'object' && v != null
						? (references.includes(v)
							? '[Circular]'
							: serialize_object(v, references)
						)
						: v
			}
			return { acc, references }
		},
		{
			acc: Object.assign(
				Array.isArray(object) ? [] : Object.create(null),
				pick(error_common_properties, object)
			),
			references: references.concat(object)
		}
	)
	.acc

export const serialize_error = value => serialize_object(value, [ ])

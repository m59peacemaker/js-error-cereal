# @m59/error-cereal

Serialize a JavaScript error to a regular, json stringifiable object, and deserialize an object into an error.

## api

```js
const { serialize_error, deserialize_error } = require('@m59/error-cereal')
```

### `serialize_error(error)`

Takes an error instance and returns a regular object that you can stringify with `JSON.stringify`.
Circular references are replaced with `'[Circular]'`.

```js
serialize_error(Object.assign(new Error('an error'), { foo: 'bar' }))
// => { name: 'Error', message: 'an error', stack: 'etc', foo: 'bar' }
```

### `deserialize_error(object, { custom_error_constructors = {} })`

Takes an object and returns an instance of the error referenced by `{ name }`. This operation is isomorphic with `serialize_error` for error instances as they were originally constructed or with added properties when those properties have values that can be converted back to their original.

Custom error constructors can be passed in and will be used to construct the error for objects with a matching { name }.

```js
deserialize_error(
	{ name: 'My_Custom_Error', message: 'error message' },
	{
		custom_error_constructors: {
			My_Custom_Error
		}
	}
)
// => new My_Custom_Error('error message')
```

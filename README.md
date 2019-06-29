# @m59/error-cereal

Serialize a JavaScript error to a regular, json stringifiable object, and deserialize an object into an error.

## api

```js
const { serializeError, deserializeError } = require('@m59/error-cereal')
```

### `serializeError(error)`

Takes an error instance and returns a regular object that you can stringify with `JSON.stringify`.
Circular references are replaced with `'[Circular]'`.

```js
serializeError(Object.assign(new Error('an error'), { foo: 'bar' }))
// => { name: 'Error', message: 'an error', stack: 'etc', foo: 'bar' }
```

### `deserializeError(object, { customErrorConstructors = {} })`

Takes an object and returns an instance of the error referenced by `{ name }`. This operation is isomorphic with `serializeError` for error instances as they were originally constructed or with added properties when those properties have values that can be converted back to their original.

Custom error constructors can be passed in and will be used to construct the error for objects with a matching { name }.

```js
deserializeError(
	{ name: 'MyCustomError', message: 'error message' },
	{
		customErrorConstructors: {
			MyCustomError
		}
	}
)
// => new MyCustomError('error message')
```

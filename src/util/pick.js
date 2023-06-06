export const pick = (keys, object) =>
	keys.reduce(
		(acc, k) => {
			if (k in object) {
				acc[k] = object[k]
			}
			return acc
		},
		{}
	)

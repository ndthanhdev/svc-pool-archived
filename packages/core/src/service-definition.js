import { reduce } from 'ramda'

// createServiceDefinition
export const createSvcDef = ({ desc = '', deps = {}, ...other }) => {
	let theDeps = {}

	if (Array.isArray(deps)) {
		reduce(
			(prev, cur) => {
				// @ts-ignore
				return {
					...prev,
					[cur]: true,
				}
			},
			theDeps,
			deps,
		)
	} else {
		theDeps = { ...deps }
	}

	return {
		...other,
		desc,
		deps: theDeps,
	}
}

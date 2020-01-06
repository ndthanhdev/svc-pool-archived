import { pipe, curry, __ } from 'ramda'
import { emit } from './utils/emitter'
import { prepareSourceProject } from './utils/loader'

export const generate = (
	input: Parameters<typeof prepareSourceProject>[number],
	output: string,
) =>
	pipe(
		() => prepareSourceProject(input),
		curry(emit)(__, output),
	)()

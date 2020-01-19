import chalk from 'chalk'
import path from 'path'
import { createLogger } from '../utils/logger'
import { generate } from '../'

const logger = createLogger(handleGen)

export default async function handleGen(
	tsConfigPath?: string,
	outDir?: string,
) {
	logger.verbose(`tsConfigPath: ${tsConfigPath}`)
	logger.verbose(`outDir: ${outDir}`)

	if (typeof tsConfigPath !== 'string') {
		console.error(chalk.red(`tsConfigPath: ${tsConfigPath} is not string`))
		process.exit(1)
	}

	if (typeof outDir !== 'string') {
		console.error(chalk.red(`outDir: ${outDir} is not string`))
		process.exit(1)
	}

	// absolute config path
	let abConfPth: string

	try {
		abConfPth = path.resolve(tsConfigPath)
	} catch (error) {
		console.error(
			chalk.red(
				`can not get absolute path from ${tsConfigPath}. See error below`,
			),
		)
		console.error(chalk.red(error))
		process.exit(1)
	}

	let abOutDir: string

	try {
		abOutDir = path.resolve(outDir)
	} catch (error) {
		console.error(
			chalk.red(`can not get absolute path from ${outDir}. See error below`),
		)
		console.error(chalk.red(error))
		process.exit(1)
	}

	try {
		console.info(`generating registry project from ${chalk.cyan(abConfPth)}`)
		await generate(abConfPth, abOutDir)
		console.info(`generated registry project to ${chalk.cyan(abOutDir)}`)
	} catch (error) {
		console.error(
			chalk.red('Cannot generate registry project. See error below'),
		)
		console.error(error)
		process.exit(1)
	}
}

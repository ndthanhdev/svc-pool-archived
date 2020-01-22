import chalk from 'chalk'
import path from 'path'
import { listRegistryFiles } from '..'
import { WrappedRegistryFile } from '../utils/guards'
import { createLogger } from '../utils/logger'
import { pipe, curry, __ } from 'ramda'

function printRegFileOutput(regFiles: WrappedRegistryFile[], baseDir: string) {
	const getRelativePathToBaseDir = curry(path.relative)(baseDir, __)

	regFiles.forEach(file =>
		pipe(
			() => file.compilerNode.fileName,
			getRelativePathToBaseDir,
			chalk.green,
			console.log,
		)(),
	)
	console.info(`total registry files: ${chalk.cyan(regFiles.length)}`)
}

const log = createLogger(handleList)
export default async function handleList(tsConfigPath?: string) {
	log.verbose(`tsConfigPath: ${tsConfigPath}`)
	if (!tsConfigPath) {
		console.error(chalk.red('tsConfigPath is not string'))
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

	console.log(`listing registry files in ${chalk.cyan(abConfPth)}`)

	const baseDir = path.parse(abConfPth).dir

	log.verbose(`baseDir: ${baseDir}`)

	try {
		const files = await listRegistryFiles(abConfPth)
		log.info(files)
		printRegFileOutput(files, baseDir)
	} catch (error) {
		log.error(error)
		console.error(chalk.red('Cannot list registry files. See error below'))
		console.error(chalk.red(error))
		process.exit(1)
	}
}

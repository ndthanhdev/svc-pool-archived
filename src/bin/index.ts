import yargs from 'yargs'
import { createLogger } from '../utils/logger'
import handleList from './handleList'
import handleGen from './handleGen'

const rootLog = createLogger('svc-p')

yargs
	.scriptName('svc-p')
	.option('verbose', {
		type: 'boolean',
		alias: 'v',
		default: false,
	})
	.command(
		['gen <tsConfigPath> <outDir>', 'generate'],
		'generate a module with declaration files from registry files in tsConfigPath to outDir',
		yargs => {
			return yargs
				.usage('gen <tsConfigPath> <outDir>')
				.positional('tsConfigPath', {
					type: 'string',
					describe: 'path to source project',
				})
				.positional('outDir', {
					type: 'string',
					describe: 'path to out dir',
				})
		},
		async argv => {
			const log = rootLog.child('generate')
			log.verbose('argv:')
			log.verbose(argv)

			await handleGen(argv.tsConfigPath, argv.outDir)
		},
	)
	.command(
		['ls <tsConfigPath>', 'list'],
		'list the declaration files in source project',
		yargs => {
			return yargs.usage('ls <tsConfigPath>').positional('tsConfigPath', {
				type: 'string',
				describe: 'path to source project',
			})
		},
		argv => {
			const log = rootLog.child('list')
			log.verbose('argv:')
			log.verbose(argv)
			handleList(argv['tsConfigPath'])
		},
	).argv

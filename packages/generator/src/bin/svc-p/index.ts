import yargs from 'yargs'
import { createLogger } from '../../utils/logger'
import { generate, listRegistryFiles } from '../../index'
import handleList from './handleList'

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
			log.verbose(argv)

			const srcDir = argv['tsConfigPath']
			if (typeof srcDir !== 'string') {
				throw new Error('tsConfigPath is not string')
			}

			const outDir = argv['outDir']
			if (typeof outDir !== 'string') {
				throw new Error('outDir is not string')
			}

			try {
				await generate(srcDir, outDir)
				log.info('success')
				console.log('success')
			} catch (error) {
				log.error('failed. See error below.')
				log.error(error)
				console.error('Cannot generate registry project.')
				console.error(error)
				process.exit(1)
			}
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
			log.verbose(argv)
			handleList(argv['tsConfigPath'])
		},
	).argv

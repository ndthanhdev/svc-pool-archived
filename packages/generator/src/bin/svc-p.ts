import yargs from 'yargs'
import { generate } from '../index'

yargs
	.scriptName('svc-p')
	.option('verbose', {
		type: 'boolean',
		alias: 'v',
		default: false,
	})
	.command(
		['gen <source-dir> <out-dir>', 'generate'],
		'generate a module with declaration files from registry files in source-dir to out-dir',
		yargs => {
			return yargs
				.usage('gen <source-dir> <out-dir>')
				.positional('source-dir', {
					type: 'string',
					describe: 'path to source project',
				})
				.positional('out-dir', {
					type: 'string',
					describe: 'path to out dir',
				})
		},
		argv => {
			console.log(argv)
			// generate(argv.source-dir, argv.out-dir)
		},
	)
	.command(
		['ls <source-dir>', 'list'],
		'list the declaration files in source project',
		yargs => {
			return yargs.usage('ls <source-dir>').positional('source-dir', {
				type: 'string',
				describe: 'path to source project',
			})
		},
		argv => {
			console.log('not implemented yet')
		},
	)
	.command(
		['count <source-dir>'],
		'count the declaration files in source project',
		yargs => {
			return yargs.usage('count <source-dir>').positional('source-dir', {
				type: 'string',
				describe: 'path to source project',
			})
		},
		argv => {
			console.log('not implemented yet')
		},
	).argv

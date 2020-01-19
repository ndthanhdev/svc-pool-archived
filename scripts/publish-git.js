/* eslint-disable 
import/no-extraneous-dependencies,
import/no-dynamic-require,
global-require, 
@typescript-eslint/no-var-requires ,
*/
const path = require('path')
const ghPages = require('gh-pages')
const debug = require('debug')

const info = debug('info:publish-git')
const error = debug('error:publish-git')

// const rootPackage = require(`../package.json`)

const publish = (base, cb) => {
	const pkg = require(`${base}/package.json`)

	const branch = `latest/${pkg.name}`

	info(`publishing ${pkg.name}`)

	function handlePublishCb(err) {
		if (err) {
			error(err)
		} else {
			info(`published ${pkg.name}`)
			cb()
		}
	}

	return ghPages.publish(
		base,
		{
			history: false,
			branch,
			// tag,
		},
		handlePublishCb,
	)
}

function publishAll(packageDirs) {
	if (packageDirs.length) {
		publish(packageDirs[0], () => publishAll(packageDirs.slice(1)))
	}
}

const dirs = [
	'packages/core',
	'packages/loader',
	'packages/react',
	'packages/generator',
].map(s => path.resolve(s))
publishAll(dirs)

/* eslint-disable import/no-extraneous-dependencies,
import/no-dynamic-require,
global-require, */
const path = require('path')
const ghPages = require('gh-pages')
const info = require('debug')('info:publish-git')
const error = require('debug')('error:publish-git')

// const rootPackage = require(`../package.json`)

function publish(base, cb) {
	const pkg = require(`${base}/package.json`)

	const branch = `latest/${pkg.name}`
	// const tag = `${pkg.name}/${rootPackage.version}`

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

const dirs = ['packages/core', 'packages/loader', 'packages/react'].map(s =>
	path.resolve(s),
)
publishAll(dirs)

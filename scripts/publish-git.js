/* eslint-disable import/no-extraneous-dependencies,
import/no-dynamic-require,
global-require, */
import path from 'path'
import ghPages from 'gh-pages'
import debug from 'debug'

const info = debug('info:publish-git')
const error = debug('error:publish-git')

// const rootPackage = require(`../package.json`)

const publish = (base, cb) =>
	import(`${base}/package.json`).then(pkg => {
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
				branch,
				// tag,
			},
			handlePublishCb,
		)
	})

function publishAll(packageDirs) {
	if (packageDirs.length) {
		publish(packageDirs[0], () => publishAll(packageDirs.slice(1)))
	}
}

const dirs = ['packages/core', 'packages/loader', 'packages/react'].map(s =>
	path.resolve(s),
)
publishAll(dirs)

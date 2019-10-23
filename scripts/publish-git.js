const path = require('path')
const ghPages = require('gh-pages')

const rootPackage = require(`../package.json`)

function publish(base, cb) {
	const package = require(`${base}/package.json`)

	const branch = `latest/${package.name}`
	const tag = `${package.name}/${rootPackage.version}`

	console.log(`publishing ${tag}`)

	return ghPages.publish(
		base,
		{
			branch,
			// tag,
		},
		err => {
			console.error(err)
			cb()
		},
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

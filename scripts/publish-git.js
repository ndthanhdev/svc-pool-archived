const ghPages = require('gh-pages')

const base = process.cwd()
const root = `${base}/../../`

const package = require(`${base}/package.json`)
const rootPackage = require(`${root}/package.json`)

const branch = `latest/${package.name}`
const tag = `${package.name}/${rootPackage.version}`

console.log(`publishing ${tag}`)

ghPages.publish(
	base,
	{
		branch,
		// tag,
	},
	console.error,
)

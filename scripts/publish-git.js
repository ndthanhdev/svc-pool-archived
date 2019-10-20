const ghPages = require('gh-pages')

const base = process.cwd()

const packagePath = `${base}/package.json`
const package = require(packagePath)

const branch = `build/${package.name}`
const tag = `${package.name}/${package.version}`

console.log(`publishing ${tag}`)

ghPages.publish(base, {
	branch,
	tag,
})

import execa from 'execa'
import { Readable } from 'stream'
import kill from 'tree-kill'
;(async () => {
	const testAssetsServer = (function() {
		const r = execa('serve', ['./test/assets/'])
		const stdout = <Readable>r.stdout
		stdout.pipe(process.stdout)
		const stderr = <Readable>r.stderr
		stderr.pipe(process.stderr)
		return r
	})()

	function cleanUp() {
		kill(testAssetsServer.pid)
	}

	process.on('SIGINT', cleanUp)

	await execa('jest', process.argv, { shell: true })
})()

import { generateSrc, listRegistryFiles } from '../src/index'
import { TestProjConfFile, TestTempDir } from './constants'

test(listRegistryFiles.name, async () => {
	const r = await listRegistryFiles(TestProjConfFile)

	expect(r.length).toBe(3)
})

test(
	generateSrc.name,
	async () => {
		await generateSrc({
			tsconfigPathOrProject: TestProjConfFile,
			outDir: TestTempDir,
		})

		expect('executed success').toBeTruthy()
	},
	3000000,
) // 5 mins

import { generate, listRegistryFiles } from '../src/index'
import { TestProjConfFile, TestTempDir } from './constants'

test(listRegistryFiles.name, async () => {
	const r = await listRegistryFiles(TestProjConfFile)

	expect(r.length).toBe(3)
})

test(generate.name, async () => {
	await generate(TestProjConfFile, TestTempDir)

	expect(true).toBe(true)
})

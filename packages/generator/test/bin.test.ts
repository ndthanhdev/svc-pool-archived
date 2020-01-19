import exc from 'execa'
import { TestProjConfFile, Bin, TestTempDir } from './constants'

test('list', async () => {
	await exc('yarn', ['ts-node', Bin, 'ls', TestProjConfFile])
	expect(true).toBe(true)
}, 30000)


test('generate', async () => {
	await exc('yarn', ['ts-node', Bin, 'gen', TestProjConfFile, TestTempDir])
	expect(true).toBe(true)
}, 3000000) // 5 mins

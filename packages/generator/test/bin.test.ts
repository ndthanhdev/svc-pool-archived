import exc from 'execa'
import { TestProjConfFile, Bin, TestTempDir } from './constants'

test('list', async () => {
	await exc('yarn', ['ts-node', Bin, 'ls', TestProjConfFile])
	expect('executed success').toBeTruthy()
}, 180000) // 3 mins

test('generate', async () => {
	await exc('yarn', ['ts-node', Bin, 'gen', TestProjConfFile, TestTempDir])
	expect('executed success').toBeTruthy()
}, 3000000) // 5 mins

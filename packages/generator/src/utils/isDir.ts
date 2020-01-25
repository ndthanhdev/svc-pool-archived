import fs from 'fs'
const { stat } = fs.promises

export default function isDir(dir: string) {
	return stat(dir).then(stat => stat.isDirectory())
}

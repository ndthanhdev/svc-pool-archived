import { SourceFile } from 'ts-morph'
import { filter } from 'ramda'
import { createLogger } from './logger'
import { isWrappedRegistryFile, WrappedRegistryFile } from './guards'

const logger = createLogger(filterNonRegistryFiles.name)

export default function filterNonRegistryFiles(srcFiles: SourceFile[]) {
	const log = logger.child(filterNonRegistryFiles)

	const r: WrappedRegistryFile[] = filter(srcFile => {
		const path = srcFile.getFilePath()
		if (!isWrappedRegistryFile(srcFile)) {
			log.verbose(`filtered out ${path}`)
			return false
		}
		log.verbose(`selected ${path}`)
		return true
	}, srcFiles)
	log.verbose(`total: ${r.length}`)
	return r;
}

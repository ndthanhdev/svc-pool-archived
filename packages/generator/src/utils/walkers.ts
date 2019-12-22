import * as ts from 'typescript'
import { all } from 'ramda'

const RegistryModuleName = '@svc-pool/core/registry'

type RegistryInterfaceDeclaration = Omit<ts.InterfaceDeclaration, 'members'> & {
	members: (Omit<ts.PropertySignature, 'type'> & {
		type: ts.ArrayTypeNode
	})[]
}

type RegistryDeclaration = Omit<ts.ModuleDeclaration, 'body'> & {
	body: Omit<ts.ModuleBlock, 'statements'> & {
		statements: ts.NodeArray<RegistryInterfaceDeclaration>
	}
}

function isRegistryInterfaceDeclaration(
	node: ts.Statement,
): node is RegistryDeclaration {
	if (
		ts.isInterfaceDeclaration(node) &&
		node.name.escapedText === 'Registry' &&
		node.modifiers &&
		node.modifiers[0].kind === ts.SyntaxKind.ExportKeyword &&
		node.modifiers[1].kind === ts.SyntaxKind.DefaultKeyword
	) {
		return true
	}

	return false
}

function isRegistryDeclaration(node: ts.Node): node is RegistryDeclaration {
	if (
		ts.isModuleDeclaration(node) &&
		node.body &&
		ts.isModuleBlock(node.body) &&
		node.body.statements &&
		node.body.statements.length > 0 &&
		all<ts.Statement>(isRegistryInterfaceDeclaration, node.body.statements)
	) {
		return true
	}

	return false
}

// list all files need for generator process
export const visitDeclarations = (sourceFile: ts.SourceFile) => {
	const nodes: ts.ModuleDeclaration[] = []

	ts.forEachChild(sourceFile, node => {
		if (isRegistryDeclaration(node)) {
			nodes.push(node)
			console.log(node.getFullText(sourceFile))
		}
	})

	return nodes
}

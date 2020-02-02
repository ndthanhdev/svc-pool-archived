import { ts, CompilerNodeToWrappedType, Node, SourceFile } from 'ts-morph'
import { all, any } from 'ramda'

export const RegistryModuleName = '@svc-pool/core/registry'

type RegistryInterfaceDeclaration = Omit<ts.InterfaceDeclaration, 'members'> & {
	members: (Omit<ts.PropertySignature, 'type'> & {
		type: ts.ArrayTypeNode
	})[]
}

export type RegistryDeclaration = Omit<ts.ModuleDeclaration, 'body'> & {
	body: Omit<ts.ModuleBlock, 'statements'> & {
		statements: ts.NodeArray<RegistryInterfaceDeclaration>
	}
}

export type WrappedRegistryDeclaration = CompilerNodeToWrappedType<
	RegistryDeclaration
>

function isRegistryPropertySignature(node: ts.Node) {
	if (
		ts.isPropertySignature(node) &&
		node.type &&
		ts.isArrayTypeNode(node.type)
	) {
		return true
	}

	return false
}

function isRegistryInterfaceDeclaration(
	node: ts.Statement,
): node is RegistryDeclaration {
	if (
		ts.isInterfaceDeclaration(node) &&
		node.name.escapedText === 'Registry' &&
		node.modifiers &&
		node.modifiers[0].kind === ts.SyntaxKind.ExportKeyword &&
		node.modifiers[1].kind === ts.SyntaxKind.DefaultKeyword &&
		all(isRegistryPropertySignature, node.members)
	) {
		return true
	}

	return false
}

export function isRegistryDeclaration(
	node: ts.Node,
): node is RegistryDeclaration {
	if (
		ts.isModuleDeclaration(node) &&
		node.name.text === RegistryModuleName &&
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

export function isWrappedRegistryDeclaration(
	wrappedNode: Node,
): wrappedNode is WrappedRegistryDeclaration {
	const cNode = wrappedNode.compilerNode

	return isRegistryDeclaration(cNode)
}

export type RegistryFile = Omit<ts.SourceFile, 'statements'> & {
	statements: ts.NodeArray<RegistryDeclaration | ts.ImportDeclaration>
}

export type WrappedRegistryFile = CompilerNodeToWrappedType<RegistryFile>

export function isRegistryFile(
	srcFile: ts.SourceFile,
): srcFile is RegistryFile {
	return any(isRegistryDeclaration, srcFile.statements)
}

export function isWrappedRegistryFile(
	srcFile: SourceFile,
): srcFile is WrappedRegistryFile {
	return isRegistryFile(srcFile.compilerNode)
}

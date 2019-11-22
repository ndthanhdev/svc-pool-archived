import BaseException from "../base-exception";
import { PointNames } from "@svc-pool/registry";

export class CircularDependency extends BaseException {
	constructor(name: PointNames) {
		super(`cannot resolve circular dependencies: ${name}`)
	}
}

export class NotRegistered extends BaseException {
	constructor(name: PointNames) {
		super(`Point requested was not registered yet: ${name}`)
	}
}

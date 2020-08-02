import { reduce } from 'ramda'

// Define service
export type Registry = {
	[key: string]: any
}

export type SvcTable<R extends Registry> = {
	[key in Point<R>]: ValueTypeOfSvc<R, key>[]
}

export type Point<R extends Registry> = keyof R

export type ValueTypeOfSvc<R extends Registry, P extends Point<R>> = R[P]

type FullDepDef<R extends Registry> = Partial<
	{
		[key in Point<R>]: boolean
	}
>

export type ServiceFactory<R extends Registry, P extends Point<R>> = (
	deps: Partial<SvcTable<R>>,
) => Promise<ValueTypeOfSvc<R, P>> | ValueTypeOfSvc<R, P>

export type FullSvcDef<R extends Registry, P extends Point<R>> = {
	point: Point<R>
	desc: string
	deps: FullDepDef<R>
	factory: ServiceFactory<R, P>
}

export type Deps<R extends Registry> = Point<R>[] | FullDepDef<R>

type MinimalSvcDef<R extends Registry, P extends Point<R>> = Omit<
	FullSvcDef<R, P>,
	'point' | 'desc' | 'deps'
> & {
	desc?: string
	deps?: Deps<R>
}

export function createSvcDef<R extends Registry>(
	point: Point<R>,
	defOrFactory:
		| MinimalSvcDef<R, typeof point>
		| ServiceFactory<R, typeof point>,
): FullSvcDef<R, typeof point> {
	if (typeof defOrFactory === 'function') {
		return {
			point,
			desc: '',
			deps: {} as FullDepDef<R>,
			factory: defOrFactory,
		}
	}

	const { deps, desc, ...other } = defOrFactory

	// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
	// @ts-ignore
	let theDeps: FullDepDef<R> = {}

	if (Array.isArray(deps)) {
		theDeps = reduce(
			(prev, cur) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
				// @ts-ignore
				return {
					...prev,
					[cur]: true,
				}
			},
			theDeps,
			deps,
		)
	} else {
		theDeps = { ...deps }
	}

	return {
		...other,
		point,
		desc,
		deps: theDeps,
	}
}

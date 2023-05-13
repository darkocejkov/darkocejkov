export type Placements = "TOP" | "BOTTOM" | "LEFT" | "RIGHT"

export type NavRoute = {
    path: string,
    element: JSX.Element,
    icon?: ReactChild,
    label?: string,
    includeInNav?: boolean,
    redirectTo?: string,
    description?: string,
}

export type FileInformation = {
    size: number,
    type: string
}

export type ReactChild = JSX.Element | JSX.Element[] | string

export type AnimationFunction = ({N, i, mult = 0.125}: FunctionProps) => number

export type FunctionProps = {
    N: number,
    i: number,
    mult?: number
}
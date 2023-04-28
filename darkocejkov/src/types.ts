export type Placements = "TOP" | "BOTTOM" | "LEFT" | "RIGHT"

export type NavRoute = {
    path: string,
    element: JSX.Element,
    icon?: string | JSX.Element,
    label?: string,
    includeInNav?: boolean,
    redirectTo?: string,
}

export type FileInformation = {
    size: number,
    type: string
}

export type ReactChild = JSX.Element | JSX.Element[] | string
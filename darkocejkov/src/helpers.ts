export const random = (max: number, plusMinus = false, min = 0, floor = true,): number => {
    let r = (Math.random() * max) + ((max / 2) * (-1 * Number(plusMinus)))

    return floor ? Math.floor(r) : r
}
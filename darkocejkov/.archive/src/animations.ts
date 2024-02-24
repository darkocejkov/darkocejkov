import {AnimationFunction, FunctionProps} from "./types.ts";

export const quadToCenter: AnimationFunction = ({N, i, mult = 1 / 25}: FunctionProps) => {
    //  since we are looking for a quadratic equation that represents delay
    //  we know that the first and the last elements should have delay of ZERO, meaning that they are the roots
    //  then, we can find the equation based on the roots with this formula:
    //      x^2 - (a  + b)x + ab = 0

    // but since the 0th index is a root, then
    //      x^2 - (0+(len-1)) + 0 = 0
    //      x^2 - (len-1)x = 0
    //      x(x - len-1)

    return (-1 * i) * (i - (N - 1)) * (mult)
}

export const toEnd: AnimationFunction = ({N, i, mult = 1 / 20}: FunctionProps) => {
    return i * mult
}

export const toBeginning: AnimationFunction = ({N, i, mult = 1 / 25}: FunctionProps) => {
    return (N - i) * mult
}
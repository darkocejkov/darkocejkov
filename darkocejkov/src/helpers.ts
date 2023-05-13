import {RefObject} from "react";

export const random = (max: number, plusMinus = false, min = 0, floor = true,): number => {
    let r = (Math.random() * max) + ((max / 2) * (-1 * Number(plusMinus)))

    return floor ? Math.floor(r) : r
}

const w = document.documentElement.clientWidth
const h = document.documentElement.clientHeight

export const base10toUnicode = (n: number): string => {
    return String.fromCodePoint(Number(`0x00${Number(n).toString(16)}`))
}

const asciiSymbols: string[] = []

for (let i = 33; i < 255; i++) {
    asciiSymbols.push(String.fromCharCode(i));
}

const unicodeSymbols: string[] = []

const unicodeRanges = [
    [8592, 8945],
    [9632, 9719],
]

for (let range of unicodeRanges) {
    for (let x = range[0]; x < range[1]; x++) {
        unicodeSymbols.push(base10toUnicode(x))
    }
}

export const px2vw = (px = 0): number => {
    return (100 * px / w);
}

export const px2vh = (px = 0): number => {
    return (100 * px / h)
}

export const vh2px = (vh = 0): number => {
    return (Math.ceil((h * vh / 100)))
}

export const vw2px = (vw = 0): number => {
    return (Math.ceil((w * vw / 100)))
}

//given that VW and VH here represent the known length of the bounding box, in viewport units
export const boundingBoxRange = (vw = 0, vh = 0) => {

    const x = (100 - vw) / 2
    const y = (100 - vh) / 2

    const domain = {
        min: vw2px(x),
        max: vw2px(x) + vw2px(vw)
    }

    const range = {
        min: vh2px(y),
        max: vh2px(y) + vh2px(vh)
    }

    return {
        domain,
        range
    }

}

export const writeClipboard = (content: string, callback?: () => void) => {
    navigator.clipboard.writeText(content)
        .then(clip => {
            if (callback) callback()
        })
}

export const smoothScrollRef = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) ref.current.scrollIntoView({behavior: 'smooth'})


}
export const randomHex = () => {
    return Math.floor(Math.random() * 16777215).toString(16);
}

export const smoothScrollTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

export const smoothScrollId = (id: string) => {

    let elem = document.getElementById(id)

    if (elem) {
        elem.scrollIntoView({
            behavior: 'smooth'
        })
    }
}

export function last(array: Array<any>) {
    return array[array.length - 1]
}

export const byteSized = (bytes: number) => {

    return {
        b: bytes,
        kb: bytes / 1000,
        mb: (bytes / (1000)) / 1000
    }

}

export const mimeType = (mime: string) => {

    if (!mime) return

    return (
        mime.split('/')[1]
    )
}

export function downloadFile(file: string, fileName = '') {
    var anchor = document.createElement('a');
    anchor.setAttribute('href', file);
    anchor.setAttribute('download', fileName);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.parentNode?.removeChild(anchor);
}

export function getFileInfo(path: string) {
    return fetch(path)
        .then(data => data.blob())
        .then(blob => {
            return blob
        })
        .catch(err => {
            console.log(`[getLocalFile] ERR`, err)

        })
}

export function humanFileSize(bytes: number, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

export const randomFromList = (array: Array<any>) => {
    return array[Math.floor(Math.random() * array.length)]
}

export const evenSpread = (max: number, current: number, base: number, dir = 1) => {
    return {
        even: (base + (dir) * (current * (1 / max))),
        ten: (base + (dir) * (current * (1 / 10)))
    }
}

function isInViewport(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

const isVisible = function (ele: HTMLElement, container: HTMLElement) {
    const eleTop = ele.offsetTop;
    const eleBottom = eleTop + ele.clientHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    // The element is fully visible in the container
    return (
        (eleTop >= containerTop && eleBottom <= containerBottom) ||
        // Some part of the element is visible in the container
        (eleTop < containerTop && containerTop < eleBottom) ||
        (eleTop < containerBottom && containerBottom < eleBottom)
    );
};

export const hasScrollLeft = (elem: HTMLElement) => {
    return !!elem.scrollLeft
}

export const maxScrollLeft = (elem: HTMLElement) => {
    return elem.scrollWidth - elem.clientWidth
}

export function getRandomFloat(min: number, max: number) {
    return (Math.random() * max) + min

}

export function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function getRandom(min: number, max: number) {
    return (Math.floor(Math.random() * max) + min)
}

// export function randomColorBased

const icons = [
    'bolt',
    'grid-2',
    'circle-xmark',
    'heart',
    'circle-half-stroke',
    'folder',
    'plus',
    'minus',
    'terminal',
    'cube',
]
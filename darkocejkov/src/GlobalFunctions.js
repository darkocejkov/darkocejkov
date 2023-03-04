export const smoothScrollRef = (ref) => {
    if(ref.current){
        ref.current.scrollIntoView({
            behavior: 'smooth'
        })
    }
}

export const randomHex = () => {
    return Math.floor(Math.random()*16777215).toString(16);
}

export const smoothScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export const smoothScrollId = (id) => {

    let elem = document.getElementById(id)

    if(elem){
        elem.scrollIntoView({
            behavior: 'smooth'
        })
    }
}

export function last(array){
    return array[array.length - 1]
}

export const byteSized = (bytes) => {

    return{
        b: bytes,
        kb: bytes / 1000,
        mb: (bytes / (1000)) / 1000
    }

}

export const mimeType = (mime) => {

    if(!mime) return

    return (
        mime.split('/')[1]
    )
}

export function downloadFile(file, fileName = ''){
    var anchor=document.createElement('a');
    anchor.setAttribute('href',file);
    anchor.setAttribute('download',fileName);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.parentNode.removeChild(anchor);
}

export function getFileInfo(path){
    return fetch(path)
        .then(data => data.blob())
        .then(blob => {
            return blob
        })
        .catch(err => {
            console.log(`[getLocalFile] ERR`, err)

        })
}

export function humanFileSize(bytes, si=false, dp=1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10**dp;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


    return bytes.toFixed(dp) + ' ' + units[u];
}

export const randomFromList = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

export const evenSpread = (max, current, base, dir = 1) => {
    return {
        even: (base + (dir)*(current * (1/max))),
        ten: (base + (dir)*(current * (1/10)))
    }
}

function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

const isVisible = function (ele, container) {
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

export const hasScrollLeft = (elem) => {
    return !!elem.scrollLeft
}

export const maxScrollLeft = (elem) => {
   return elem.scrollWidth - elem.clientWidth
}

export function getRandomFloat(min, max){
    return (Math.random() * max) + min

}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

export function getRandom(min, max){
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
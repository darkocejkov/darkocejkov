export const smoothScrollRef = (ref) => {
    if(ref.current){
        ref.current.scrollIntoView({
            behavior: 'smooth'
        })
    }
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
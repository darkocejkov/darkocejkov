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

import React, {useState, useEffect, useRef, useCallback} from "react";

export const useDragScroll = ({container, id}) => {

    const [hasScroll, setHasScroll] = useState(null)


    const checkHasScroll = () => {

        let elem = document.getElementById(id)

        if(!elem) return null

        let maxScrollLeft = elem.scrollWidth - elem.clientWidth

        if(maxScrollLeft <= 0){
            setHasScroll(false)
        }else if(hasScroll === false){
            setHasScroll(true)
        }

        // return null
    }

    useEffect(() => {
        checkHasScroll()
        window.addEventListener('resize', checkHasScroll)

        return () => {
            window.removeEventListener('resize', checkHasScroll)
        }
    }, [])

    const positionRef = useRef({
        left: 0,
        x: 0,
    })

    const mouseDownHandler = function (e) {
        positionRef.current = {
            // The current scroll
            left: container.current.scrollLeft,
            // Get the current mouse position
            x: e.clientX
        };

        container.current.addEventListener('mousemove', mouseMoveHandler);
        container.current.addEventListener('mouseup', mouseUpHandler);
        container.current.addEventListener('mouseleave', mouseLeaveHandler);
        container.current.style.cursor = 'grabbing'
    };

    const mouseMoveHandler = function (e) {
        const dx = e.clientX - positionRef.current.x;

        // Scroll the element
        container.current.scrollLeft = positionRef.current.left - dx;
    };

    const mouseLeaveHandler = function (e) {
        container.current.removeEventListener('mousemove', mouseMoveHandler);
        container.current.removeEventListener('mouseup', mouseUpHandler);
        container.current.removeEventListener('mouseleave', mouseLeaveHandler);

        container.current.style.cursor = 'auto'
    }

    const mouseUpHandler = function (e) {
        container.current.removeEventListener('mousemove', mouseMoveHandler);
        container.current.removeEventListener('mouseup', mouseUpHandler);
        container.current.removeEventListener('mouseleave', mouseLeaveHandler);

        container.current.style.cursor = 'grab'
    }



    return {
        mouseDownHandler,
        hasScroll
    }
}
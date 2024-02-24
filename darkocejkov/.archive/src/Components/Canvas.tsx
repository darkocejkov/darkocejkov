/*
    Darko Cejkov
    2023

    CANVAS (HTML) components
    - uses hooks and effects to safely render and coop with state

 */

import React, {useState, useEffect, useRef} from "react";

type Scale = {
    x: number,
    y: number
}

type Size = {
    w: number,
    h: number
}

const textToDraw = "darko cejkov."

// const animateName =

const drawName = (ctx: CanvasRenderingContext2D | null, w: number, h: number, scaleX: number, scaleY: number) => {
    if (ctx) {
        ctx.font = "10rem Tabi"

        const len = ctx.measureText(textToDraw)

        ctx.textAlign = 'center'
        ctx.fillText(textToDraw, (w / 2), h / 2)

        let anim
        let frameCount = 0
        const render = () => {
            frameCount++

            anim = window.requestAnimationFrame(render)
        }
    }
}

const scaleWidth = 500;
const scaleHeight = 500;


export const Canvas = ({drawFunction}: {
    drawFunction: () => void
}) => {

    const [scale, setScale] = useState<Scale>({x: 1, y: 1});
    const [size, setSize] = useState<Size>({w: 0, h: 0});

    const canvas = useRef<HTMLCanvasElement>(null);

    const resized = () => {
        if (!canvas.current) return
        canvas.current.width = document.body.clientWidth;
        canvas.current.height = document.body.clientHeight;
        setSize({w: document.body.clientWidth, h: document.body.clientHeight});
    };

    // useEffect(() => resized(), []);
    useEffect(() => {
        resized()

        if (!canvas.current) return

        const currentCanvas = canvas.current;
        currentCanvas.addEventListener("resize", resized);

        return () => currentCanvas.removeEventListener("resize", resized);

    }, []);

    useEffect(() => {
        if (!canvas.current || !drawFunction) return
        // drawName(canvas.current.getContext("2d"), document.body.clientWidth, document.body.clientHeight, scale.x, scale.y);


    }, [size]);

    return <canvas ref={canvas} style={{width: "100%", height: "100%"}}/>;

}
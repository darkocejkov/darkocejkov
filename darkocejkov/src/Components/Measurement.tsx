import {boundingBoxRange, vw2px} from "../helpers.ts";
import React from "react";

const boundingW = 90
const boundingH = 90

const differenceX = (100 - boundingW) / 2
const differenceY = (100 - boundingH) / 2

const bounding = boundingBoxRange(boundingW, boundingH)

const Measure = () => {
    return (
        <div className={'bg-slate-900 fixed'} style={{
            height: '1px',
            width: `${vw2px(differenceX)}px`,
            top: '50vh',
            left: 0
        }}/>
    )
}
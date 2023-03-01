
import React, {useEffect, useState, useRef, useMemo} from "react";
import {Box, FunctionButton, InfoBox, Toggle} from "../Components/Basics";
import {motion} from 'framer-motion'
import {getRandom, getRandomArbitrary} from "../GlobalFunctions";

const hMax = 100
const hMin = 0

const wMax = 100
const wMin = 0

export const FlexView = ({}) => {

    const nBoxes = 100

    const [height, setHeight] = useState(100)
    const [width, setWidth] = useState(100)
    const [gap, setGap] = useState(0)
    const [equal, setEqual] = useState(true)

    const [shrink, setShrink] = useState(0)
    const [grow, setGrow] = useState(0)
    const [basis, setBasis] = useState(100)

    const [gapUnit, setGapUnit] = useState('px')

    const [controls, setControls] = useState(true)
    const [random, setRandom] = useState(false)

    const [labelled, setLabelled] = useState(true)


    const flipSizes = () => {

        let t = height

        setHeight(width)
        setWidth(t)
    }

    // const randomizeSizes = () => {
    //
    //     setHeight(getRandomArbitrary(1, 100))
    //
    // }



    useEffect(() => {
        if(equal){
            if(height > 0){
                setWidth(height)
            }else{
                setHeight(width)
            }
        }
    }, [equal])

    const boxArray = useMemo(() => {

        let h = height
        let w = width

        let array = []

        for(let x = 0; x < nBoxes; x++){

            if(random){
                h = getRandom(75, 100)
                w = getRandom(75, 100)
            }



            array.push(
                <Box
                    i={x}
                    h={h}
                    w={w}
                    grow={grow}
                    shrink={shrink}
                    controls={controls}
                />
            )
        }


        return array

        // return Array(nBoxes).fill(
        //     <Box
        //         h={h}
        //         w={w}
        //         grow={grow}
        //         shrink={shrink}
        //         controls={controls}
        //     />
        // )
    }, [height, width, random, controls])


    const [wrap, setWrap] = useState(true)
    const [row, setRow] = useState(true)

    const [overX, setOverX] = useState(true)
    const [overY, setOverY] = useState(true)
    const [p, sp] = useState(0)


    return(
        <div className='min-h-screen w-screen z-10 overflow-x-hidden bg-gradient-to-b to-cyan-200 from-blue-500 p-12 flex flex-col gap-5 justify-center items-center select-none perspective-none'>

            <h1 className={'text-xl'}>Flexbox Settings</h1>
            <div className={'w-[80vw] shadow-lg p-4 flex flex-wrap gap-4'}>

                <Toggle set={setWrap} value={wrap}>
                    {wrap
                        ? "flex: wrap"
                        : "flex: nowrap"
                    }
                </Toggle>

                <Toggle set={setEqual} value={equal}>
                    {equal
                        ? "equal dimensions"
                        : "unequal dimensions"
                    }
                </Toggle>

                <Toggle set={setRow} value={row}>
                    {row
                        ? "flex: row"
                        : "flex: col"
                    }
                </Toggle>

                <Toggle set={setLabelled} value={labelled}>
                    {labelled
                        ? "Index Labels"
                        : "No Index Label"
                    }
                </Toggle>

                <Toggle set={setControls} value={controls}>
                    {controls
                        ? "box controls"
                        : "no box controls"
                    }
                </Toggle>


                {!equal &&
                    <>

                        <div className={'p-2 flex flex-col'}>
                            <label>H
                                <span className={'ml-1'}>
                                    {height}px
                                </span>
                            </label>
                            <input disabled={random} type={'range'} min={1} max={100} step={1} value={height} onChange={(e) => setHeight(parseInt(e.target.value))}/>
                        </div>

                        <div className={'p-2 flex flex-col'}>
                            <label>W
                                <span className={'ml-1'}>
                                    {width}px
                                </span>
                            </label>
                            <input disabled={random} type={'range'} min={1} max={100} step={1} value={width} onChange={(e) => setWidth(parseInt(e.target.value))}/>
                        </div>


                        <FunctionButton fn={() => flipSizes()}>
                            Flip H/W
                        </FunctionButton>

                        <Toggle set={setRandom} value={random}>
                            {random
                                ? "Random H/W"
                                : "Labelled H/W"
                            }
                        </Toggle>


                    </>
                }

                <div className={'p-2 flex flex-col'}>
                    <label>Gap
                        <span className={'ml-1'}>
                            {gap}px
                        </span>
                    </label>
                    <input type={'range'} min={0} max={100} step={1} value={gap} onChange={(e) => setGap(parseInt(e.target.value))}/>
                </div>

                <div className={'p-2 flex flex-col'}>
                    <label>Grow
                        <span className={'ml-1'}>
                            {grow}x
                        </span>
                    </label>
                    <input type={'range'} min={0} max={5} step={1} value={grow} onChange={(e) => setGrow(parseInt(e.target.value))}/>
                </div>

                <div className={'p-2 flex flex-col'}>
                    <label>Shrink
                        <span className={'ml-1'}>
                            {shrink}x
                        </span>
                    </label>
                    <input type={'range'} min={0} max={5} step={1} value={shrink} onChange={(e) => setShrink(parseInt(e.target.value))}/>
                </div>

            </div>

            <h1 className={'text-xl'}>Container Settings</h1>
            <div className={'w-[80vw] shadow-lg p-4 flex flex-wrap gap-4'}>
                <Toggle set={setOverX} value={overX}>
                    {overX
                        ? "overflow-x scroll"
                        : "overflow-x hidden"
                    }
                </Toggle>

                <Toggle set={setOverY} value={overY}>
                    {overY
                        ? "overflow-y scroll"
                        : "overflow-y hidden"
                    }
                </Toggle>

                <div className={'p-2 flex flex-col'}>
                    <label>Padding
                        <span className={'ml-1'}>
                                    {p}px
                                </span>
                    </label>
                    <input type={'range'} min={0} max={100} step={1} value={p} onChange={(e) => sp(parseInt(e.target.value))}/>
                </div>
            </div>


            <motion.div
                layout
                animate={{
                    overflowY: overY ? 'scroll' : 'hidden',
                    overflowX: overX ? 'scroll' : 'hidden',
                    padding: `${p}px`
                }}
                className={`h-[80vh] w-[80vw] ${overY ? 'overflow-y-scroll' : 'overflow-y-hidden'} ${overX ? 'overflow-x-scroll' : 'overflow-x-hidden'} shadow-lg`}>
                <motion.div className={`h-full w-full flex`}
                    animate={{
                        flexWrap: wrap ? 'wrap' : 'nowrap',
                        gap: `${gap}px`,
                        flexDirection: row ? 'row' : 'column'
                    }}
                    layout
                >
                    {boxArray}
                </motion.div>
            </motion.div>
        </div>
    )

}
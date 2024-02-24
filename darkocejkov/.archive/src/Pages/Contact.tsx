import React, {useState} from "react";
import {Rule} from "../Components/Layout.tsx";

import {Tooltip} from "antd";
import {useToast} from "../Hooks/Toast.tsx";
import {writeClipboard} from "../helpers.ts";
import {motion} from "framer-motion";
import {FiArrowRight, FiMail} from "react-icons/fi";
import {Pane} from "../Components/Window.tsx";

export default function Contact({}) {


    const {addToast} = useToast()

    const copyToClip = (text: string) => {
        writeClipboard(text, () => addToast(`Copied: "${text}"`))
    }


    return (
        <div className={'flex flex-col justify-center items-center gap-3 max-w-full w-full p-3'}>
            <Pane id={'contact'}>
                <form>
                    <div className={'flex flex-col gap-6 p-2 '}>

                        <p className={'font-tabi lg:text-6xl md:text-4xl text-2xl flex flex-wrap flex-row items-center justify-center'}>
                            <span>darkocheykov</span>
                            <span>@</span>
                            <span>gmail.com</span>
                        </p>

                        <div className={'flex flex-row gap-2'}>
                            <Tooltip title={'MAILTO'}>
                                <a
                                    href={'mailto:darkocheykov@gmail.com'}
                                    className={'font-rubik flex-1 cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg transition-all active:bg-slate-900/20 justify-center items-center flex gap-3'}>
                                    <i className="fa-regular fa-at self-center fa-lg p-2"></i>
                                </a>
                            </Tooltip>

                            <Tooltip title={'COPY'}>
                                <button
                                    onClick={() => copyToClip('darkocheykov@gmail.com')}
                                    type={'button'}
                                    className={'font-rubik flex-1 cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg transition-all active:bg-slate-900/20 justify-center items-center flex gap-3'}>

                                    <i className="fa-regular fa-link self-center fa-lg p-2"></i>
                                </button>
                            </Tooltip>
                        </div>


                        {/*<div className={'flex gap-2 flex-nowrap md:text-3xl text-2xl font-tabi'}>*/}
                        {/*    <Rule/>*/}
                        {/*    OR*/}
                        {/*    <Rule/>*/}
                        {/*</div>*/}

                        {/*<input*/}
                        {/*    type={'email'}*/}
                        {/*    autoComplete={'email'}*/}
                        {/*    className={'w-full p-3 rounded-xl bg-slate-900/10 placeholder-slate-900/60 font-aeonik outline-0'}*/}
                        {/*    placeholder={'email@domain.tld'}/>*/}

                        {/*<textarea*/}
                        {/*    className={'w-full p-3 max-h-[20vh] min-h-[3rem] rounded-xl bg-slate-900/10 placeholder-slate-900/60 font-aeonik outline-0'}*/}
                        {/*    placeholder={'Your message ...'}/>*/}

                        {/*<SendButton/>*/}
                    </div>
                </form>
            </Pane>
        </div>

    )
}

const SendButton = () => {

    const [hover, setHover] = useState(false)

    return (
        <button
            type={'submit'}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className={'font-rubik text-xl md:text-2xl group cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg justify-center items-center transition-all active:bg-slate-900/20 flex gap-3 relative'}>
            <p>Send Message</p>

            <motion.span
                className={'absolute left-3/4'}
                initial={{
                    translateX: '0%'
                }}
                animate={{
                    translateX: hover ? '120%' : '0%',
                    opacity: hover ? 0 : 1,
                    rotateZ: hover ? '180deg' : '0deg',
                }}
            >
                <FiArrowRight/>
            </motion.span>

            <motion.span
                className={'absolute left-3/4'}
                initial={{
                    translateX: '0%'
                }}
                animate={{
                    translateX: hover ? '120%' : '0%',
                    opacity: hover ? 1 : 0,
                    rotateZ: hover ? '360deg' : '180deg',
                }}
                // transition={{
                //     delay: 0.06
                // }}
            >
                <FiMail/>
            </motion.span>
        </button>
    )
}
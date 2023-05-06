/*
    BASED ON:
    https://medium.com/@aibolkussain/creating-toast-api-with-react-hooks-94e454379632
 */

import {ReactChild} from "../types.ts";
import {AnimatePresence, motion} from "framer-motion";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";

import {createPortal} from "react-dom";

type Toast = {
    message: ReactChild,
    id: number,
    options?: ToastOptions
}

type ToastOptions = {
    duration: number,
    dismissable?: boolean,
}

interface ToastFunctions {
    addToast: (message: string, options?: ToastOptions) => void,
    removeToast: (id: number) => void,
}

const ToastContext = createContext<ToastFunctions | null>(null)

export const ToastProvider = ({children}: {
    children: ReactChild
}) => {

    const id = useRef(0)

    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((message: string, options?: ToastOptions) => {
        setToasts(toasts => [
            ...toasts,
            {id: id.current++, message, options}
        ])
    }, [setToasts])

    const removeToast = useCallback((id: number) => {
        setToasts(toasts => toasts.filter(t => t.id !== id))
    }, [setToasts])

    return (
        <ToastContext.Provider value={{addToast, removeToast}}>
            <ToastContainer toasts={toasts}/>
            {children}
        </ToastContext.Provider>
    )
}

export const ToastContainer = ({toasts}: {
    toasts: Toast[]
}) => {
    return createPortal(
        <div className={'fixed left-12 bottom-12 flex flex-col gap-2 transition-all'}>
            <AnimatePresence>
                {toasts.map(t => {
                    return <Toast key={t.id} id={t.id} options={t.options}>{t.message}</Toast>
                })}
            </AnimatePresence>
        </div>,
        document.body
    )
}

export const useToast = (): ToastFunctions => {

    const helpers = useContext(ToastContext)

    return {
        addToast: helpers?.addToast,
        removeToast: helpers?.removeToast
    } as ToastFunctions
}

const animationTransitionS = 0.1
const animationTransitionMS = 1000 * animationTransitionS
const toastDuration = 5

export const Toast = ({children, id, options}: {
    children: ReactChild,
    id: number,
    options?: ToastOptions
}) => {

    const {removeToast} = useToast()

    const variants = {
        visible: {
            opacity: 1,
            translateX: '0%',
            rotateZ: '0deg',
            scale: 1,
            transition: {
                duration: animationTransitionS
            }

        },
        hidden: {
            opacity: 0,
            translateX: '-100%',
            rotateZ: '40deg',
            scale: 0.9,
            transition: {
                duration: animationTransitionS
            }
        },
    }

    const duration = options?.duration !== undefined ? options?.duration : 5000 //ms

    useEffect(() => {

        if (duration > 0) {
            setTimeout(() => {
                // setVariant('hidden')
                removeToast(id)
                // setTimeout(() => {
                //     removeToast(id)
                // }, animationTransitionMS)
            }, duration)
        }


    }, [])

    return (
        <motion.div
            className={'bg-white/30 py-2 pl-4 pr-8 font-rubik text-2xl rounded-lg relative z-30 overflow-hidden backdrop-blur-md'}
            variants={variants}
            initial='hidden'
            animate='visible'
            exit={'hidden'}

            transition={{
                type: 'spring'
            }}
        >
            {children}

            <button className={'absolute top-[-5px] right-[5px]'} onClick={() => removeToast(id)}>
                <i className="fa-solid fa-xmark fa-xs"></i>
            </button>

            {duration > 0 &&
                <motion.div
                    className={'absolute bottom-0 left-0 h-[5px] z-40 bg-orange-400 rounded-xl'}
                    initial={{
                        width: '0%'
                    }}
                    animate={{
                        width: '100%'
                    }}
                    transition={{
                        type: 'linear',
                        duration: duration / 1000
                    }}
                />
            }

        </motion.div>
    )
}
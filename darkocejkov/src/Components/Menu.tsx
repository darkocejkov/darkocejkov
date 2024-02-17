import {FileInformation, ReactChild} from "../types.ts";
import React, {useEffect, useState} from "react";
import {getFileInfo, humanFileSize, mimeType} from "../helpers.ts";

export const MenuWrapper = ({children, items = [], open = false}: {
    children: ReactChild,
    items?: FileInformation[],
    open?: boolean

}) => {

    const [show, setShow] = useState(false)

    // useEffect(() => {
    //     console.log(items)
    // }, [])

    return (
        <div className={'relative'} onClick={() => setShow(!show)} onMouseLeave={() => setShow(false)}>

            {children}

            <div
                className={`${show ? 'scale-1' : 'scale-0'} backdrop-blur-md origin-bottom left-0 -top-full transition-all absolute rounded-xl p-2 bg-slate-900/40 text-white`}>
                <div className={'flex flex-col gap-2'}>
                    {items && items.map((x, i) => {
                        return (
                            <>
                                <MenuItem {...x}/>

                                {i !== items.length - 1 &&
                                    <hr/>
                                }
                            </>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
const MenuItem = ({label, onClick, file}: {
    label: string,
    onClick?: () => void,
    file: File,
    size: number,
    type: string
}) => {

    const [info, setInfo] = useState<FileInformation | null>(null)

    useEffect(() => {
        getFileInfo(file)
            .then((data: FileInformation) => {
                setInfo(data)
                return
            })
    }, [])

    return (
        <button type={'button'} onClick={() => onClick ? onClick() : null} className={'p-1 rounded-sm '}>
            {label}

            {info &&
                <code className={'mx-1'}>
                    ({humanFileSize(info.size, true, 2)})
                </code>
            }

            {info &&
                <code className={'mx-1'}>
                    ({mimeType(info.type)})
                </code>
            }

        </button>
    )

}
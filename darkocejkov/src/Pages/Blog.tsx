import React, {createContext, MouseEventHandler, useContext, useEffect, useState} from "react";
import {motion} from "framer-motion";

import {
    useInfiniteQuery,
    useQuery,
    useQueryClient
} from '@tanstack/react-query'
import {LipSum5} from "../helpers.ts";
import {repoContents, treeContents} from "../api/knowledge.ts";
import {InfiniteQueryObserverResult} from "@tanstack/query-core/build/lib/types";
import {Tooltip} from "antd";
import {Pane} from "../Components/Window.tsx";
import {BasicLink} from "../Components/Navigation.tsx";
import {Spinner} from "../Components/Display.tsx";

type FileType = 'dir' | 'file'
type File = {
    name: string,
    type: FileType,
    url: string,
    html_url: string,
    path: string,
    size: number,
    sha: string,
}

type Context = {
    selected: File | undefined,
    setSelected: React.Dispatch<React.SetStateAction<File | undefined>>
}

const SelectContext = createContext<Context | null>(null)


const blogData = require('../api/blog.json')
export default function Blog({}) {

    const queryClient = useQueryClient()


    const [tree, setTree] = useState<File[]>([])
    const [selected, setSelected] = useState<File | undefined>()

    const [expand, setExpand] = useState(true)

    return (
        <>
            <HeaderText/>

            <Pane id={'blog'} className={'flex flex-row gap-3 max-h-[70vh] w-full'}>
                <div
                    className={'p-2 flex flex-col gap-2 max-h-full min-h-[30vh] min-w-fit overflow-y-auto rounded-xl bg-white/20'}>

                    <SelectContext.Provider value={{selected, setSelected}}>
                        <RootTree/>
                    </SelectContext.Provider>


                </div>


                <>
                    {!selected &&
                        <div
                            className={'font-mono flex gap-1 justify-center flex-1 items-center bg-white/20 rounded-lg'}>
                            <div className={'text-slate-900/60'}>
                                no file selected <i className="fa-sharp fa-solid fa-file-slash ml-2"></i>
                            </div>
                        </div>
                    }


                    {selected &&
                        <div
                            className={'p-3 relative font-mono items-center overflow-y-auto overscroll-contain bg-white/20 rounded-lg'}>
                            <Tooltip title={'Unselect'}>

                                <button
                                    onClick={() => setSelected(undefined)}
                                    className={'h-[25px] w-[25px] rounded-full bg-slate-900/60 top-10 right-10 fixed flex justify-center items-center hover:bg-white group transition-all'}>
                                    <i className="fa-solid fa-xmark text-white self-center group-hover:text-slate-900 transition-all"></i>
                                </button>
                            </Tooltip>

                            <code className={'break-all'}>
                                {JSON.stringify(selected)}
                            </code>
                        </div>
                    }
                </>
            </Pane>


        </>
    )
}

const RootTree = () => {
    const {data, status, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage} = useInfiniteQuery({
        queryKey: ['knowledge'],
        queryFn: ({pageParam = ''}) => {
            console.log(`[queryFn] pageParam`, {pageParam})
            return treeContents(pageParam)
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    // https://tanstack.com/query/v4/docs/react/guides/infinite-queries
    // https://github.com/TanStack/query/discussions/413
    // https://codesandbox.io/p/sandbox/react-query-tree-structure-forked-bn062g?file=%2Fsrc%2FApp.tsx&selection=%5B%7B%22endColumn%22%3A1%2C%22endLineNumber%22%3A34%2C%22startColumn%22%3A1%2C%22startLineNumber%22%3A34%7D%5D


    switch (status) {
        case 'loading':

            return (
                <div className={'h-full w-full flex items-center justify-center'}>
                    <Spinner/>
                </div>
            )

        case 'error':
            return (
                <div className={'h-full w-full flex items-center justify-center'}>
                    Error <i className="fa-regular fa-face-frown ml-1"></i>
                </div>
            )
        case 'success':
            console.log({data})

            return (
                <>
                    {data.pages.map(page => {

                        return page.data.map((d: File) => {
                            return <File key={d.sha} file={d} fetchNextPage={fetchNextPage}/>
                        })
                    })}
                </>
            )
        default:
            return <></>
    }

}

const File = ({file, fetchNextPage}: {
    file: File,
    fetchNextPage: (param?: object) => void
}) => {

    const selector = useContext(SelectContext)

    let icon: JSX.Element | null = null

    if (file.type === 'dir') {
        icon = <i className="fa-regular fa-folder fa-xs"></i>
    } else if (file.type === 'file') {
        icon = <i className="fa-regular fa-file fa-xs"></i>
    }

    let handleClick: MouseEventHandler<HTMLButtonElement> | undefined
    if (file.type === 'dir') {
        handleClick = () => {
            fetchNextPage({pageParam: file.url})
        }
    } else if (file.type === 'file') {
        handleClick = () => {
            selector?.setSelected(file)
        }
    }

    const isSelected = selector?.selected?.sha === file.sha || false

    return (
        <button
            onClick={handleClick}
            className={`${isSelected ? 'bg-orange-400/40' : 'bg-slate-900/10'} font-rubik text-xl bg-opacity-100 shadow-sm hover:shadow-lg transition-all rounded-xl py-1 px-4 gap-2 flex justify-start items-center`}>
            {icon} {file.name}
        </button>
    )
}

const HeaderText = () => (
    <>
        <motion.h1
            initial={{
                opacity: 0,
            }}
            animate={{
                opacity: 1,
            }}
            className={'text-6xl text-center font-tabi text-slate-900'}>
            Personal Knowledge Base
        </motion.h1>

        <motion.div
            className={'overflow-hidden'}
        >
            <motion.h3
                initial={{
                    opacity: 0,
                }}
                animate={{
                    opacity: 1,
                }}
                className={'text-xl text-center font-aeonik text-slate-900 h-full max-w-[70vw]'}
            >
                A component that allows you to browse the markdown files I use to take notes. I use <BasicLink
                url={'https://obsidian.md'}>Obsidian</BasicLink> for text/markdown notes,
                and <BasicLink
                url={'https://www.notion.so/darkocheykov/Darko-Cejkov-4ad2da60e1da4b83a24c3fbd809293be?pvs=4'}>Notion</BasicLink> for
                database notes. The resources that are displayed here are fetched from the <BasicLink
                url={'https://github.com/darkocejkov/knowledge'}>repository</BasicLink> I use to publicly share my
                notes, and sync between machines - hosted on GitHub.
                <br/>
                Use this custom UI to browse and read my notes, musings, rants,
            </motion.h3>
        </motion.div>
    </>
)

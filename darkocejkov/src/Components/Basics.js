import React, {useState} from 'react'

export const CustomLink = ({}) => {
    return null
}

export const Banner = ({children}) => {

    return(
        <div className={'backdrop-blur-sm z-50 fixed top-0 inset-x-0 font-tabi p-2 bg-slate-900/70 text-white flex justify-center lg:items-center uppercase'}>
            {children}
        </div>
    )

}

export const Button = ({}) => {

    return(
        <button></button>
    )

}
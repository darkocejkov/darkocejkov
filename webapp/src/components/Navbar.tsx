import React from "react";

type Direction = 'top' | 'bottom'

const Navbar = ({direction, children}: {
    direction: Direction,
    children: React.ReactNode
}) => {

    switch(direction) {
        case "bottom":
            return (
                <div className={'z-20 fixed left-0 bottom-0 px-10 w-screen backdrop-blur'}>
                    <div className={`w-full h-10 border-t-[1px]`}>
                        <div className={'w-full h-full flex justify-around items-center gap-2'}>
                            {children}
                        </div>
                    </div>
                </div>
            )
        case "top":
            return (
                <div className={'z-20 fixed left-0 top-0 px-10 w-screen backdrop-blur'}>
                    <div className={`w-full h-10 border-b-[1px]`}>
                        <div className={'w-full h-full flex justify-around items-center gap-2'}>
                            {children}
                        </div>
                    </div>
                </div>
            )
    }
}

export default Navbar;
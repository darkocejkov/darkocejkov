import React from "react";
import {SubtitleRule} from "../Components/Basics.tsx";

export default function NotFound({}) {
    return (
        <>
            <div className={'h-full w-full flex justify-center items-center flex-col'}>
                <SubtitleRule classes={'text-9xl w-full text-center font-fira'} textPos={'center'}>
                    404
                </SubtitleRule>
                <h5 className={'uppercase font-aeonik'}>
                    area not found
                </h5>
            </div>

            {/*<i className="fa-regular fa-face-frown-slight text-9xl fixed"></i>*/}
        </>
    )
}
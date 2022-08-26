import React, { useState, useEffect } from 'react';

export default function FoldPage({content}){


    // TODO: LEARN + CREATE some component/interface that allows for animating classes.

    return (
        <div className={`transition-all fade-in-top flex justify-center linear-progressive-blur hover:backdrop-blur-lg`}>
            <div className="w-fit h-80 overflow-y-auto p-5">
                {content}
            </div>

        </div>
    )
}

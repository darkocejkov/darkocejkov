import React, { useState, useEffect } from 'react';
import FoldPage from '../Components/FoldPage';

export default function Education(props){

    const [o, so] = useState(0)
    const [t, st] = useState('-translate-x-1/2')

    useEffect(() => {
        console.log('MOUNTING')
        st('translate-x-0')
        
        setTimeout(() => {
            so(100)
        }, 50)

        return () => {
            console.log('UNMOUNTING')
            st('translate-x-1/2')


            so(0)
            setTimeout(() => {
                
            }, 240)
            
            
        }
    }, [])

    return(
        <FoldPage
            content={
                <div>
                    <h1 className="text-4xl font-tabi dark:text-white mt-10">
                    Honors BSc.&nbsp;
                        <span className="group hover:bg-opacity-80 bg-black bg-opacity-20 rounded-lg p-2 transition-colors hover:multi-shadow-open-br">Computer Science
                            <span className="group-hover:opacity-100 opacity-0 transition-opacity absolute right-[43%] -mt-14 ">
                                GPA: <span className="font-sectraDisplay">8.9</span> of <span className="font-sectraDisplay">12</span>
                            </span>
                        </span> +&nbsp;
                        <span className="group hover:bg-opacity-80 bg-black bg-opacity-20 rounded-lg p-2 transition-colors hover:multi-shadow-open-br">Psychology
                            <span className="group-hover:opacity-100 opacity-0 transition-opacity absolute right-[25%] -mt-14">
                                GPA: <span className="font-sectraDisplay">8.3</span> of <span className="font-sectraDisplay">12</span>
                            </span>
                        </span>
                    </h1>
                    

                    <h3 className="mt-2 ml-16 text-2xl font-sectra">Wilfrid <span className="text-[#320071] decoration-[#f2a900] hover:text-[#f2a900] hover:decoration-[#320071] underline transition-colors">Laurier</span> University <i class="fa-duotone fa-leaf-maple mx-3 hover:-rotate-90 text-text-[#320071] transition-all"></i></h3>
                </div>
            }
        />
    )
}
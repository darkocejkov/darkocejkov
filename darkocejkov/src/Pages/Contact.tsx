import React from "react";
import {CTAButton, Pane, Rule} from "../Components/Basics.tsx";
import {Tooltip} from "antd";

export default function Contact({}) {
    return (
        <Pane id={'contact'}>
            <form>
                <div className={'flex flex-col gap-6 px-12'}>

                    <p className={'font-tabi text-2xl'}>
                        darkocheykov@gmail.com
                    </p>

                    <div className={'flex flex-row gap-2'}>

                        <Tooltip title={'Mailto Email'}>
                            <a
                                href={'mailto:darkocheykov@gmail.com'}
                                className={'font-rubik flex-1 cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg transition-all active:bg-slate-900/20 justify-center items-center flex gap-3'}>
                                <i className="fa-regular fa-at self-center fa-lg p-2"></i>
                            </a>
                        </Tooltip>

                        <Tooltip title={'Copy Email'}>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText('darkocheykov@gmail.com')
                                }}
                                type={'button'}
                                className={'font-rubik flex-1 cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg transition-all active:bg-slate-900/20 justify-center items-center flex gap-3'}>

                                <i className="fa-regular fa-link self-center fa-lg p-2"></i>
                            </button>
                        </Tooltip>

                    </div>


                    <div className={'flex gap-2 flex-nowrap font-tabi'}>
                        <Rule/>
                        OR
                        <Rule/>
                    </div>

                    <input
                        type={'email'}
                        autoComplete={'email'}
                        className={'w-full p-3 rounded-xl bg-slate-900/10 placeholder-slate-900/60 font-aeonik outline-0'}
                        placeholder={'email@domain.tld'}/>

                    <textarea
                        className={'w-full p-3 max-h-[20vh] min-h-[3rem] rounded-xl bg-slate-900/10 placeholder-slate-900/60 font-aeonik outline-0'}
                        placeholder={'Your message ...'}/>

                    <CTAButton label={'Send Message'}/>

                    {/*<button*/}
                    {/*    className={'font-rubik cursor-pointer bg-slate-900/10 p-3 button-shadow rounded-lg justify-center transition-all active:bg-slate-900/20 flex gap-3'}>*/}
                    {/*    <p>Send Email</p>*/}
                    {/*    <i className="fa-regular fa-arrow-right self-center fa-xl"></i>*/}
                    {/*</button>*/}
                </div>
            </form>
        </Pane>
    )
}
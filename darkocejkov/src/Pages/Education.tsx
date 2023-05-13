import React from "react";
import {InfoBox, Link, StatBox, TitleRule, TooltipWrapper, Pane, TextBox} from "../Components/Basics.tsx";
import {Tooltip} from "antd";

export default function Education() {

    return (
        <Pane id={'education'}>
            <h2 className="md:text-4xl text-2xl font-tabi">
                Honors BSc. Computer Science & Psychology
            </h2>
            <TitleRule classes={'md:text-2xl text-xl font-maru font-bold uppercase'}>
                <>
                    Wilfrid Laurier University (2016 - 2022)
                    <div className={`hr-fill`}/>
                    <p>GPA of <b>8.9</b> of 12 overall
                        <Tooltip className={'inline ml-1'} title={"9.8 Computer Science, 8.6 Psychology"}>
                            <i className="fa-solid fa-circle-info fa-sm self-center"></i>
                        </Tooltip>
                    </p>

                </>
            </TitleRule>

            <h2 className={'text-xl md:text-2xl font-maru uppercase'}>
                Double Major - 20 credits.
            </h2>

            <h3 className={'mt-2 font-aeonik font-bold'}>Courses of Interest</h3>
            <div className={'flex flex-wrap flex-1 gap-2 mt-2 font-aeonik'}>
                <TooltipWrapper className={'flex-1'}
                                tooltip={'The study of theoretical mathematics as applied in Graph Theory and Number Theory.'}>
                    <StatBox title={'Discrete Mathematics'} stat={'A-'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Experimenting with problem-solving tasks, comparing differences between pathfinding algorithms.'}>
                    <StatBox title={'Artificial Intelligence'} stat={'A-'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Learning to prove mathematical theories and axioms via logic'}>
                    <StatBox title={'Mathematical Proofs'} stat={'A-'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Leveraging Python to understand core concepts for various data structures and managing data.'}>
                    <StatBox title={'Data Structures I & II'} stat={'B / B+'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Learning practical hierarchies, inheritance, classes and objects concepts through Java.'}>
                    <StatBox title={'Object-Oriented Programming'} stat={'A-'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Learning theoretical microprocessor logic and simulation of ARM/ASSEMBLY, understanding how high-language code gets compiled down into machine code.'}>
                    <StatBox title={'Microprocessors'} stat={'B'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Using C to understand operating system theory such as kernels, and scheduling operations in a low-level OS context.'}>
                    <StatBox title={'Operating Systems'} stat={'B'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Understanding the intricacies of calculus concepts like limits, functions, integrations and derivatives.'}>
                    <StatBox title={'Calculus I'} stat={'B'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Hands-on linux learning to use terminal-based systems, understanding what/how commands work and creating our own.'}>
                    <StatBox title={'Linux System Programming'} stat={'A-'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Learning theoretical relational databse theories, how to create and manage SQL-based databases'}>
                    <StatBox title={'Database I & II'} stat={'A- / A'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Participating in a large group project, applying AGILE and project management methodologies.'}>
                    <StatBox title={'Software Engineering'} stat={'A-'}/>
                </TooltipWrapper>
                <TooltipWrapper className={'flex-1'}
                                tooltip={'Hands-on Raspberry Pi coding in Python, utilizing physical components such as actuators and displays.'}>
                    <StatBox title={'Physical Computing'} stat={'A+'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Understanding the design and application of various well-known algorithms, and the key to designing efficient algorithms.'}>
                    <StatBox title={'Algorithms'} stat={'A'}/>
                </TooltipWrapper>

                <TooltipWrapper className={'flex-1'}
                                tooltip={'Testing the limits and lowest level computation logic using state machines and Turing machines.'}>
                    <StatBox title={'Foundations of Computing'} stat={'A+'}/>
                </TooltipWrapper>
                <TooltipWrapper className={'flex-1'}
                                tooltip={'Conducting guided research and writing in various topics of perception'}>
                    <StatBox title={'Research in Perception'} stat={'A-'}/>
                </TooltipWrapper>
                <TooltipWrapper className={'flex-1'} tooltip={'Pursuing contemporary research in perception.'}>
                    <StatBox title={'Sem. in Perception'} stat={'A'}/>
                </TooltipWrapper>
                <TooltipWrapper className={'flex-1'}
                                tooltip={'Pursuing contemporary research in cognitive neuroscience.'}>
                    <StatBox title={'Sem. in Cog. Neuroscience'} stat={'B-'}/>
                </TooltipWrapper>

            </div>

            <div className={'flex flex-col gap-2 mt-2'}>

                <h3 className={'font-aeonik font-bold'}>My Experience</h3>
                <TextBox className={'font-rubik md:p-6 font-thin text-xl flex flex-col gap-5'}>
                    <p>University was both an obstacle and a lesson. My personal crux was less about the content, and
                        more about myself and the purpose of learning. Going into university, I was under-prepared, and
                        tried using lazy approaches to passing courses - I failed many times.
                        When I got the dreaded letter of official notice for academic probation, I couldn't let myself
                        fail out of school, and I started to really put in effort to not only stay afloat, but succeed
                        many of my peers.
                    </p>
                    <p>
                        When I focused, I got very deep into learning about many different programming languages. Most
                        surprisingly, I started loving math - especially theoretical discrete maths.
                    </p>
                </TextBox>

            </div>

            <div className={'flex flex-col gap-2 mt-2'}>

                <h3 className={'font-aeonik font-bold'}>Why Psychology <em>and</em> Computer Science?</h3>
                <TextBox className={'font-rubik md:p-6 font-thin text-xl flex flex-col gap-5'}>
                    <p>
                        Scientific psychology has quite a lot of overlap in computer science. My specialization was
                        neuroscience - which if you are being reductionist, is similar to electronic circuitry.
                        Psychology as a displine itself is also very interesting and can be very deep, because it's
                        rooted in philosophy, and especially something that can be quite meta, the human condition and
                        experience.

                    </p>
                </TextBox>

            </div>

        </Pane>
    )
}
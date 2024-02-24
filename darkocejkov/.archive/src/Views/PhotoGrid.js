// import React, {useState, useEffect, Suspense} from "react";
//
// import axios from 'axios'
// import {LoadingSpinner} from "../Components/Basics";
//
// const tenPhotos = require('../data/TenNASAPhotos.json')
// const hunPhotos = require('../data/100NASAPhotos.json')
//
// const fetchPhotos = () => {
//
// }
//
// export const SuspenseGrid = ({}) => {
//
//     const [photoData, setPhotoData] = useState(null)
//
//     const photos = fetchPhotos()
//
//     const getPhotos = () => {
//
//     }
//
//     useEffect(() => {
//
//     }, [])
//
//     return(
//
//         <Suspense fallback={
//             <h1>Loading !</h1>
//         }>
//             <div className={'flex flex-row gap-2'}>
//
//             </div>
//         </Suspense>
//     )
//
// }
//
// const PhotoSkeleton = ({}) => (
//     <div className={'h-[30vh] w-[40vw] bg-slate-700/60 animate-pulse rounded-xl'} />
// )
//
// const SimplePhoto = ({url}) => (
//     <img alt={''} src={url} className={'h-[30vh] w-auto object-cover'}/>
// )
//
// const Photo = ({copyright, date, explanation, hdurl, url, media_type, title}) => {
//     return(
//
//         <div className={'image-container'}>
//
//             <div className={'image-overlay font-aeonik text-center p-2'}>
//                 <h2>{title}</h2>
//                 <h4 className={''}>{copyright}</h4>
//                 <h5>{date}</h5>
//                 <small title={explanation} className={'line-clamp-3'}>"{explanation}"</small>
//
//                 <div className={'flex justify-evenly'}>
//                     <button className={'rounded-lg hover:scale-125 transition-all p-2 border h-[2rem] w-[2rem] flex justify-center items-center'}>
//                         <i className="fa-solid fa-download"></i>
//                     </button>
//                 </div>
//             </div>
//
//             <img src={url} alt={title} className={'image'}/>
//
//         </div>
//
//     )
//     // return(
//     //     <div className={'relative'}>
//     //         <div className={'rounded-xl opacity-0 hover:opacity-70 bg-slate-900 absolute top-0 left-0 transition-opacity h-full w-full'}>
//     //
//     //         </div>
//     //
//     //
//     //         <img src={url} alt={title} className={'rounded-xl h-100 p-3 shadow bg-gradient-to-r from-[#ffffff] to-slate-900/10'}/>
//     //     {/*    h-1/2 p-3 shadow bg-gradient-to-r from-[#ffffff] to-slate-900/10 */}
//     //     </div>
//     // )
// }
//
// export const PhotoGrid = () => {
//
//     const [photoData, setPhotoData] = useState(null)
//
//     // let photos = Array(50).fill(
//     //     {
//     //         "copyright": "Maxime Daviron",
//     //         "date": "2020-01-13",
//     //         "explanation": "A good place to see a ring-of-fire eclipse, it seemed, would be from a desert. In a desert, there should be relatively few obscuring clouds and trees.  Therefore late last December a group of photographers traveled to the United Arab Emirates and Rub al-Khali, the largest continuous sand desert in world, to capture clear images of an unusual eclipse that would be passing over.  A ring-of-fire eclipse is an annular eclipse that occurs when the Moon is far enough away on its elliptical orbit around the Earth so that it appears too small, angularly, to cover the entire Sun. At the maximum of an annular eclipse, the edges of the Sun can be seen all around the edges of the Moon, so that the Moon appears to be a dark spot that covers most -- but not all -- of the Sun. This particular eclipse, they knew, would peak soon after sunrise.  After seeking out such a dry and barren place, it turned out that some of the most interesting eclipse images actually included a tree in the foreground, because, in addition to the sand dunes, the tree gave the surreal background a contrasting sense of normalcy, scale, and texture.    Explore the Universe: Random APOD Generator",
//     //         "hdurl": "https://apod.nasa.gov/apod/image/2001/DesertEclipse_Daviron_2000.jpg",
//     //         "media_type": "image",
//     //         "service_version": "v1",
//     //         "title": "A Desert Eclipse",
//     //         "url": "https://apod.nasa.gov/apod/image/2001/DesertEclipse_Daviron_960.jpg"
//     //     }
//     // )
//
//     let photos = []
//
//
//     // NASA API key
//     // TM5M2C6AKD5QlcSrJ8JLFWnmKtESXHgb8gHNQmsa
//     //      ex:  https://api.nasa.gov/planetary/apod?api_key=TM5M2C6AKD5QlcSrJ8JLFWnmKtESXHgb8gHNQmsa
//     const getPhotos = async () => {
//         await axios.get(`https://api.nasa.gov/planetary/apod?count=100&api_key=TM5M2C6AKD5QlcSrJ8JLFWnmKtESXHgb8gHNQmsa`)
//             .then(data => {
//                 console.log(`getPhotos: `, data)
//                 setPhotoData(data.data)
//             })
//             .catch(err => {
//                 console.log(`getPhotos ERROR:`, err)
//             })
//     }
//
//
//
//     useEffect(() => {
//         // getPhotos()
//         // console.log(photos)
//
//         console.log(`tenPhotos`, tenPhotos)
//     }, [])
//
//
//
//     return(
//
//         <div className='min-h-screen w-screen z-10 overflow-x-hidden bg-gradient-to-b to-cyan-200 from-blue-500 p-12 flex flex-col gap-5 justify-center items-center select-none perspective-none'>
//
//             <div className={'rounded-xl container h-[50vh] p-2 overflow-auto shadow-lg'}>
//                 <div className={'flex flex-wrap gap-2'}>
//                     <Dogs />
//                 </div>
//
//             </div>
//
//             <div className={'rounded-xl container h-[50vh] p-2 overflow-auto shadow-lg'}>
//                 {hunPhotos &&
//                     <div className={'image-grid'}>
//                         {hunPhotos.map(x => {
//                             return(
//                                 <Photo {...x}/>
//                             )
//                         })}
//                     </div>
//                 }
//             </div>
//         </div>
//     )
// }
//
// const Dogs = () => {
//
//     const fetchCount = 5
//
//     const [data, setData] = useState(null)
//     const [err, setErr] = useState(null)
//     const [isLoading, setIsLoading] = useState(false)
//
//     const fetchData = () => {
//
//         setIsLoading(true)
//
//         axios.get(`https://dog.ceo/api/breeds/image/random/${fetchCount}`)
//             .then(data => {
//                 console.log('DOGDATA:', data)
//
//                 setData(data.data?.message)
//                 setIsLoading(false)
//                 // return data.data
//
//             })
//             .catch(err => {
//                 // return 'ERR'
//                 setErr(err)
//                 setIsLoading(false)
//             })
//
//     }
//
//     useEffect(() => {
//         fetchData()
//     }, [])
//
//     return(
//         <>
//             {isLoading &&
//                 Array(fetchCount).fill(<PhotoSkeleton />)
//             }
//
//             {err
//                 ? (
//                     <h1 className={'text-2xl text-red-700 text-center'}>Error fetching data!</h1>
//                 )
//                 : (
//                     data && data.map(x => {
//                         return <SimplePhoto url={x}/>
//                     })
//                 )}
//         </>
//     )
// }
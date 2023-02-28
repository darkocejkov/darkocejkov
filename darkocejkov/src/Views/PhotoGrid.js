import React, {useState, useEffect, Suspense} from "react";

import axios from 'axios'
import {LoadingSpinner} from "../Components/Basics";

const fetchPhotos = () => {

}

export const SuspenseGrid = ({}) => {

    const [photoData, setPhotoData] = useState(null)

    const photos = fetchPhotos()

    const getPhotos = () => {

    }

    useEffect(() => {

    }, [])

    return(

        <Suspense fallback={
            <h1>Loading !</h1>
        }>
            <div className={'flex flex-row gap-2'}>

            </div>
        </Suspense>
    )

}

const Photo = ({copyright, date, explanation, hdurl, url, media_type, title}) => {
    return(

        <div className={'image-container'}>

            <div className={'image-overlay font-aeonik text-center p-2'}>
                <h2>{title}</h2>
                <h4 className={''}>{copyright}</h4>
                <h5>{date}</h5>
                <small title={explanation} className={'line-clamp-3'}>"{explanation}"</small>

                <div className={'flex justify-evenly'}>
                    <button className={'rounded-lg hover:scale-125 transition-all p-2 border h-[2rem] w-[2rem] flex justify-center items-center'}>
                        <i className="fa-solid fa-download"></i>
                    </button>
                </div>
            </div>

            <img src={url} alt={title} className={'image'}/>

        </div>

    )
    // return(
    //     <div className={'relative'}>
    //         <div className={'rounded-xl opacity-0 hover:opacity-70 bg-slate-900 absolute top-0 left-0 transition-opacity h-full w-full'}>
    //
    //         </div>
    //
    //
    //         <img src={url} alt={title} className={'rounded-xl h-100 p-3 shadow bg-gradient-to-r from-[#ffffff] to-slate-900/10'}/>
    //     {/*    h-1/2 p-3 shadow bg-gradient-to-r from-[#ffffff] to-slate-900/10 */}
    //     </div>
    // )
}

export const PhotoGrid = () => {

    const [photoData, setPhotoData] = useState(null)

    // let photos = Array(50).fill(
    //     {
    //         "copyright": "Maxime Daviron",
    //         "date": "2020-01-13",
    //         "explanation": "A good place to see a ring-of-fire eclipse, it seemed, would be from a desert. In a desert, there should be relatively few obscuring clouds and trees.  Therefore late last December a group of photographers traveled to the United Arab Emirates and Rub al-Khali, the largest continuous sand desert in world, to capture clear images of an unusual eclipse that would be passing over.  A ring-of-fire eclipse is an annular eclipse that occurs when the Moon is far enough away on its elliptical orbit around the Earth so that it appears too small, angularly, to cover the entire Sun. At the maximum of an annular eclipse, the edges of the Sun can be seen all around the edges of the Moon, so that the Moon appears to be a dark spot that covers most -- but not all -- of the Sun. This particular eclipse, they knew, would peak soon after sunrise.  After seeking out such a dry and barren place, it turned out that some of the most interesting eclipse images actually included a tree in the foreground, because, in addition to the sand dunes, the tree gave the surreal background a contrasting sense of normalcy, scale, and texture.    Explore the Universe: Random APOD Generator",
    //         "hdurl": "https://apod.nasa.gov/apod/image/2001/DesertEclipse_Daviron_2000.jpg",
    //         "media_type": "image",
    //         "service_version": "v1",
    //         "title": "A Desert Eclipse",
    //         "url": "https://apod.nasa.gov/apod/image/2001/DesertEclipse_Daviron_960.jpg"
    //     }
    // )

    let photos = [
        {
            "copyright": "Rolf Olsen",
            "date": "2014-05-15",
            "explanation": "Cruising through the outer solar system, the Voyager 2 spacecraft made its closest approach to Neptune on August 25, 1989, the only spacecraft to visit the most distant ice giant planet. Based on the images recorded during its close encounter and in the following days, this inspired composited scene covers the dim outer planet, largest moon Triton, and faint system of rings. From just beyond Neptune's orbit, the interplanetary perspective looks back toward the Sun, capturing the planet and Triton as thin sunlit crescents. Cirrus clouds and a dark band circle Neptune's south polar region, with a cloudy vortex above the pole itself. Parts of the very faint ring system along with the three bright ring arcs were first imaged by Voyager during the fly-by, though the faintest segments are modeled in this composited picture. Spanning 7.5 degrees, the background starfield is composed from sky survey data centered on the constellation Camelopardalis, corresponding to the outbound Voyager's view of the magnificent Neptunian system.",
            "hdurl": "https://apod.nasa.gov/apod/image/1405/Neptune-South-Pole-Voyager-2_2327x1670.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "Voyager's Neptune",
            "url": "https://apod.nasa.gov/apod/image/1405/Neptune-South-Pole-Voyager-2_950x682.jpg"
        },
        {
            "copyright": "WFIMPG/ESO 2.2-m TelescopeLa SillaESO",
            "date": "2007-08-22",
            "explanation": "The largest, most violent star forming region known in the whole Local Group of galaxies lies in our neighboring galaxy the Large Magellanic Cloud (LMC).  Were the Tarantula Nebula at the distance of the Orion Nebula -- a local star forming region -- it would take up fully half the sky.  Also called 30 Doradus, the red and pink gas indicates a massive emission nebula, although supernova remnants and dark nebula also exist there.  The bright knot of stars left of center is called R136 and contains many of the most massive, hottest, and brightest stars known.  The above image taken with the European Southern Observatory's (ESO's) Wide Field Imager is one of the most detailed ever of this vast star forming region.  ESO has made it possible to fly around and into this detailed image by clicking here.",
            "hdurl": "https://apod.nasa.gov/apod/image/0708/tarantula_eso_big.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "Tentacles of the Tarantula Nebula",
            "url": "https://apod.nasa.gov/apod/image/0708/tarantula_eso.jpg"
        },
        {
            "date": "2007-01-26",
            "explanation": "Like grains of sand on a cosmic beach, individual stars of barred spiral galaxy NGC 1313 are resolved in this sharp composite from the Hubble Space Telescope's Advanced Camera for Surveys (ACS). The inner region of the galaxy is pictured, spanning about 10,000 light-years. Hubble's unique ability to distinguish individual stars in the 14 million light-year distant galaxy has been used to unravel the fate of star clusters whose bright young stars are spread through the disk of the galaxy as the clusters dissolve. The exploration of stars and clusters in external galaxy NGC 1313 offers clues to star formation and star cluster evolution in our own Milky Way.",
            "hdurl": "https://apod.nasa.gov/apod/image/0701/ngc1313_hst.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "The Star Clusters of NGC 1313",
            "url": "https://apod.nasa.gov/apod/image/0701/ngc1313_hst_c720.jpg"
        },
        {
            "copyright": "Royal Observatory, EdinburghAnglo-Australian \nObservatory",
            "date": "1996-06-13",
            "explanation": "About 11,000 years ago a star in the constellation of Vela exploded.  This bright supernova may have been visible to the first human farmers. Today the Vela supernova remnant marks the position of a relatively close and recent explosion in our Galaxy. A roughly spherical, expanding shock wave is visible in X-rays. In the above optical photograph, the upper left corner of the spherical blast wave is shown in detail. As gas flies away from the detonated star, it reacts with the interstellar medium, knocking away closely held electrons from even heavy elements. When the electrons recombine with these atoms, light in many different colors and energy bands is produced.",
            "hdurl": "https://apod.nasa.gov/apod/image/vela_roe.gif",
            "media_type": "image",
            "service_version": "v1",
            "title": "Vela Supernova Remnant in Optical",
            "url": "https://apod.nasa.gov/apod/image/vela_roe.gif"
        },
        {
            "copyright": "Robert Gendler",
            "date": "2002-06-20",
            "explanation": "Big and beautiful spiral galaxy M81, in the northern constellation Ursa Major, is one of the brightest galaxies visible in the skies of planet Earth. This superbly detailed view reveals its bright nucleus, grand spiral arms and sweeping cosmic dust lanes with a scale comparable to the Milky Way. Hinting at a disorderly past, a remarkable dust lane runs straight through the disk, below and right of the galactic center, contrary to M81's other prominent spiral features. The errant dust lane may be the lingering result of a close encounter between M81 and its smaller companion galaxy, M82. Scrutiny of variable stars in M81 (aka NGC 3031) has yielded one of the best determined distances for an external galaxy -- 11.8 million light-years.",
            "hdurl": "https://apod.nasa.gov/apod/image/0206/m81_gendler_big.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "Bright Galaxy M81",
            "url": "https://apod.nasa.gov/apod/image/0206/m81_gendler_c1.jpg"
        },
        {
            "copyright": "Anglo-Australian Telescope\nBoard",
            "date": "1998-04-21",
            "explanation": "Is Orion all wet?  Recent observations have confirmed that water molecules now exist in the famous Orion Nebula, and are still forming.  The Orion Nebula (M42, shown above) is known to be composed mostly of hydrogen gas, with all other atoms and molecules being comparatively rare. The nebula is so vast, though, that even the measured minuscule production rate creates enough water to fill Earth's oceans 60 times over every day, speculate discoverers led by M. Harwit (Cornell).  The water that composes comets, the oceans of Earth, and even humans may have been created in a cloud like the Orion Nebula.",
            "hdurl": "https://apod.nasa.gov/apod/image/9804/oriondust_aat_big.gif",
            "media_type": "image",
            "service_version": "v1",
            "title": "Water in Orion",
            "url": "https://apod.nasa.gov/apod/image/9804/oriondust_aat.jpg"
        },
        {
            "date": "2004-06-25",
            "explanation": "On June 21st, pilot Mike Melvill made a historic flight in the winged craft dubbed SpaceShipOne -- the first private manned mission to space. The spaceship reached an altitude of just over 62 miles (100 kilometers) on a suborbital trajectory, similar to the early space flights in NASA's Mercury Program. So, how was the view? A video camera on an earlier test flight that climbed 40 miles recorded this picture looking west over the southern California coast and the Earth's limb. In the foreground, the nozzle of SpaceShipOne's hybrid rocket is visible along with the edge of the wing in a \"feathered\" configuration for reentry. SpaceShipOne was designed and built by Burt Rutan and his company Scaled Composites to compete for the 10 million dollar X Prize.",
            "hdurl": "https://apod.nasa.gov/apod/image/0406/14pssone_scaled.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "Planet Earth from SpaceShipOne",
            "url": "https://apod.nasa.gov/apod/image/0406/14pssone_scaled_c1.jpg"
        },
        {
            "date": "2016-01-14",
            "explanation": "Cosmic dust clouds ripple across this infrared portrait of our Milky Way's satellite galaxy, the Large Magellanic Cloud. In fact, the remarkable composite image from the Herschel Space Observatory and the Spitzer Space Telescope show that dust clouds fill this neighboring dwarf galaxy, much like dust along the plane of the Milky Way itself. The dust temperatures tend to trace star forming activity. Spitzer data in blue hues indicate warm dust heated by young stars. Herschel's instruments contributed the image data shown in red and green, revealing dust emission from cooler and intermediate regions where star formation is just beginning or has stopped. Dominated by dust emission, the Large Magellanic Cloud's infrared appearance is different from views in optical images. But this galaxy's well-known Tarantula Nebula still stands out, easily seen here as the brightest region to the left of center. A mere 160,000 light-years distant, the Large Cloud of Magellan is about 30,000 light-years across.",
            "hdurl": "https://apod.nasa.gov/apod/image/1601/PIA15254_LMC2048.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "Infrared Portrait of the Large Magellanic Cloud",
            "url": "https://apod.nasa.gov/apod/image/1601/PIA15254_LMC900c.jpg"
        },
        {
            "date": "1997-08-02",
            "explanation": "Three thousand light years away, a dying star throws off shells of glowing gas. This image from the Hubble Space Telescope reveals \"The Cat's Eye Nebula\" to be one of the most complex planetary nebulae known. In fact, the features seen in this image are so complex that astronomers suspect the bright central object may actually be a binary star system. The term planetary nebula, used to describe this general class of objects, is misleading. Although these objects may appear round and planet-like in small telescopes, high resolution images reveal them to be stars surrounded by cocoons of gas blown off in the late stages of stellar evolution.",
            "hdurl": "https://apod.nasa.gov/apod/image/catseye_hst_big.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "The Cat's Eye Nebula",
            "url": "https://apod.nasa.gov/apod/image/catseye_hst.jpg"
        },
        {
            "date": "1999-10-31",
            "explanation": "Three thousand light-years away, a dying star throws off shells of glowing gas.  This image from the Hubble Space Telescope reveals The Cat's Eye Nebula to be one of the most complex planetary nebulae known.  In fact, the features seen in the Cat's Eye are so complex that astronomers suspect the bright central object may actually be a binary star system. The term planetary nebula, used to describe this general class of objects, is misleading. Although these objects may appear round and planet-like in small telescopes, high resolution images reveal them to be stars surrounded by cocoons of gas blown off in the late stages of stellar evolution. On planet Earth, of course, cats and other creatures may be on the prowl tonight. Keep your eyes peeled and have a safe and happy Halloween!",
            "hdurl": "https://apod.nasa.gov/apod/image/catseye_hst_big.jpg",
            "media_type": "image",
            "service_version": "v1",
            "title": "The Cat's Eye Nebula",
            "url": "https://apod.nasa.gov/apod/image/catseye_hst.jpg"
        }
    ]

    // NASA API key
    // TM5M2C6AKD5QlcSrJ8JLFWnmKtESXHgb8gHNQmsa
    //      ex:  https://api.nasa.gov/planetary/apod?api_key=TM5M2C6AKD5QlcSrJ8JLFWnmKtESXHgb8gHNQmsa
    const getPhotos = async () => {
        await axios.get(`https://api.nasa.gov/planetary/apod?count=100&api_key=TM5M2C6AKD5QlcSrJ8JLFWnmKtESXHgb8gHNQmsa`)
            .then(data => {
                console.log(`getPhotos: `, data)
                setPhotoData(data.data)
            })
            .catch(err => {
                console.log(`getPhotos ERROR:`, err)
            })
    }

    useEffect(() => {
        // getPhotos()
        // console.log(photos)
    }, [])

    return(

        <>
            {photos &&

                <div className={'flex justify-center'}>
                    <div className={'image-grid mt-12'}>
                        {photos.map(x => {
                            return(
                                <Photo {...x}/>
                            )
                        })}
                    </div>
                </div>


                // <div className={'h-screen w-screen flex flex-row flex-wrap gap-2 columns-3'}>
                //     {photos.map(x => {
                //         return(
                //             <Photo {...x}/>
                //         )
                //     })}
                // </div>
            }

            {!photoData &&
                <LoadingSpinner />
            }
        </>
    )
}
export const random = (max: number, plusMinus = false, min = 0, floor = true,): number => {
    let r = (Math.random() * max) + ((max / 2) * (-1 * Number(plusMinus)))

    return floor ? Math.floor(r) : r
}

const w = document.documentElement.clientWidth
const h = document.documentElement.clientHeight

export const px2vw = (px = 0): number => {
    return (100 * px / w);
}

export const px2vh = (px = 0): number => {
    return (100 * px / h)
}

export const vh2px = (vh = 0): number => {
    return (Math.ceil((h * vh / 100)))
}

export const vw2px = (vw = 0): number => {
    return (Math.ceil((w * vw / 100)))
}

//given that VW and VH here represent the known length of the bounding box, in viewport units
export const boundingBoxRange = (vw = 0, vh = 0) => {

    const x = (100 - vw) / 2
    const y = (100 - vh) / 2

    const domain = {
        min: vw2px(x),
        max: vw2px(x) + vw2px(vw)
    }

    const range = {
        min: vh2px(y),
        max: vh2px(y) + vh2px(vh)
    }

    return {
        domain,
        range
    }

}

export const writeClipboard = (content: string, callback?: () => void) => {
    navigator.clipboard.writeText(content)
        .then(clip => {
            if (callback) callback()
        })
}

export const LipSum5 = () => {
    return (
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris id justo eget sapien facilisis
    malesuada vel non erat. Vestibulum non ligula non ex malesuada consequat. Donec sodales faucibus
    accumsan. Aliquam sit amet porttitor ante. Fusce arcu tellus, commodo nec euismod quis, vulputate at
    velit. Ut iaculis tellus vel ante sodales luctus. Curabitur a ante placerat, sodales sapien eget,
        auctor nunc. Integer sed placerat orci. Nam elementum erat nisi, condimentum condimentum ante
    suscipit facilisis. Mauris et convallis tortor, in ullamcorper mauris. Nam ut fermentum sapien. Sed
    et turpis vel metus facilisis congue. Pellentesque habitant morbi tristique senectus et netus et
    malesuada fames ac turpis egestas. Ut in urna at arcu hendrerit tincidunt eu accumsan mi. Quisque
    consequat sem eu justo scelerisque finibus. Praesent ligula lectus, tempor id congue eu, sodales id
    ante.

        Praesent tellus lacus, porta vitae turpis sed, cursus lobortis risus. Vivamus sagittis tempus augue,
        a porttitor elit porta et. Curabitur varius lectus eu risus porta tristique. Cras sodales accumsan
    tellus, sit amet pulvinar odio. Mauris elementum lacus ut est molestie iaculis. Maecenas scelerisque
    quam sem, vulputate sollicitudin sem ultrices eget. Aliquam ultrices in neque id gravida. Sed lorem
    orci, congue quis augue id, lobortis tristique turpis. Aliquam porta condimentum nulla, vel semper
    tortor tempus eget. Proin sit amet ex justo. Integer consequat efficitur nunc, quis imperdiet est
    varius at. Etiam eget volutpat turpis. Suspendisse eu tellus at quam efficitur ultrices. Proin
    consequat enim ut pharetra facilisis. Nullam venenatis vitae est eu fringilla. Cras dictum vehicula
    felis eu tincidunt.

        Praesent vulputate nulla a eros fringilla, viverra elementum libero ultrices. Class aptent taciti
    sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec sed condimentum metus.
        Cras fermentum dolor id neque dictum, ut fringilla elit semper. Nam lorem enim, viverra vitae erat
    quis, volutpat pulvinar libero. Nunc congue sapien vel semper feugiat. Aenean ac consequat diam.
        Mauris id sagittis massa. Aliquam erat volutpat.

        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vitae nulla sed elit vehicula
    interdum ut in metus. Cras viverra vestibulum mauris, et ornare mauris iaculis quis. Suspendisse
    potenti. Mauris mollis placerat cursus. Integer varius quis libero nec egestas. Aliquam ut fermentum
    metus. Phasellus eget mi sed lorem laoreet lacinia. In aliquam egestas rhoncus. Praesent tincidunt
    hendrerit convallis. Pellentesque eget ultricies metus. Mauris congue interdum sapien non cursus.
        Donec congue bibendum pharetra. Curabitur ultricies scelerisque volutpat. Curabitur non interdum
    diam, vitae egestas erat.

        Phasellus lacinia maximus nisi, in imperdiet est blandit eu. In lectus dui, semper vitae efficitur
    nec, pharetra in erat. Morbi nec lorem pharetra, tempus leo sit amet, dapibus augue. Nam ut aliquet
    dui, vitae tristique risus. Vivamus vestibulum est vestibulum facilisis mattis. Suspendisse
    venenatis viverra nibh in feugiat. Ut vitae magna consequat, vehicula ligula a, finibus metus. Morbi
    vulputate metus id egestas dapibus. Quisque massa felis, condimentum vitae tristique vel, suscipit
    eget magna. Suspendisse potenti. Morbi ut facilisis nisi. Morbi eros eros, viverra eleifend lorem
    sit amet, dapibus placerat orci. Vivamus vel sem non tortor tincidunt aliquam.`
    )
}
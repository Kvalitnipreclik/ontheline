let whiteLine = 1

radio.setFrequencyBand(0)
radio.setGroup(1)
radio.setTransmitPower(7)


const data: Array<any> = [
    {
        foward: false,
        left: false,
        right: false

    }
]
input.onButtonPressed(Button.B, function() {
    bezCary()
})
radio.onReceivedNumber(function (receivedNumber: number) {
    smerjizdy = receivedNumber

    basic.showLeds(`
    . . . . .
    . . . # .
    # . # . .
    . # . . .
    . . . . .
    `)
})



let spatnyMotor = 215 / 255
let smerjizdy: number = 1
let zamek = false
//kolo 67mm

let speeindwex = 160
let rovne: number
let zatacky: number
function motory(rovne: number, zatacky: number) {

    let motorM1 = rovne - zatacky
    let motorM4 = (rovne + zatacky)





    PCAmotor.MotorRun(PCAmotor.Motors.M1, motorM1 * speeindwex)
    PCAmotor.MotorRun(PCAmotor.Motors.M4, motorM4 * speeindwex * spatnyMotor)

}



let stav = 0
let objekt = {
    foward: false,
    left: false,
    right: false

}
const pinF = DigitalPin.P15
const pinL = DigitalPin.P14
const pinR = DigitalPin.P13

pins.setPull(pinF, PinPullMode.PullNone)
pins.setPull(pinL, PinPullMode.PullNone)
pins.setPull(pinR, PinPullMode.PullNone)

let orientaceKrizovatkyT: number


// hlavni rozhodovaní
basic.forever(function () {
    if (zamek) {
        let Foward = (whiteLine ^ pins.digitalReadPin(pinF)) == 0 ? false : true
        let Left = (whiteLine ^ pins.digitalReadPin(pinL)) == 0 ? false : true
        let Right = (whiteLine ^ pins.digitalReadPin(pinR)) == 0 ? false : true

        let ultrasonic = ping(DigitalPin.P2, DigitalPin.P1)
        objekt.foward = Foward
        objekt.left = Left
        objekt.right = Right

        //krizovatka
        if (!Left && !Right && !Foward) {
            if (data[data.length - 1].foward === false) {
                krizovatkaX()
            }



        } else if (!Left && !Foward) {

        } else if (!Right && !Foward) {

        }
        if (!Left && !Right && !Foward) {

        }



        if (!Right) {
            rovne = 0
            zatacky = -0.7
            motory(rovne, zatacky)
        } else if (Right && Foward === false) {
            rovne = 0.6
            zatacky = -0.4
            motory(rovne, zatacky)
        }
        if (!Left) {
            rovne = 0
            zatacky = 0.7
            motory(rovne, zatacky)
        } else if (Left && Foward === false) {
            rovne = 0.6
            zatacky = 0.4
            motory(rovne, zatacky)
        }
        if (!Foward) {
            rovne = 1
            zatacky = 0
            motory(rovne, zatacky)
        }


        if (Left && Right && Foward) {
            if (data[data.length - 1].left === false) {
                rovne = 1.2
                zatacky = -0.4
                motory(rovne, zatacky)
            } else if (data[data.length - 1].right === false) {
                rovne = 1.2
                zatacky = 0.4
                motory(rovne, zatacky)
            } else if (data[data.length - 1].foward === false) {
                bezCary()
            }
        }

        //mánévry



        motory(rovne, zatacky)






        data.push(objekt)

        if (data.length > 20) {
            data.shift()
        }
        basic.pause(10)
    }




})

//ultrazvuk
function ping(trig: DigitalPin, echo: DigitalPin, maxCmDistance = 500): number {
    pins.setPull(trig, PinPullMode.PullNone)
    pins.digitalWritePin(trig, 0)
    control.waitMicros(2)
    pins.digitalWritePin(trig, 1)
    control.waitMicros(10)
    pins.digitalWritePin(trig, 0)


    const a = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58)
    let sosCoef = 1 / ((331 + 0.607 * (25 - 4)) / 10000 / 2)
    return Math.round(a / sosCoef)

}


    







let stranaOtace = 2
//zatacka o 90 stupnu
function zatackaPravehoUhlu() {
    motory(0, stranaOtace)
    basic.pause(375)
}
//krizovatkaX
function krizovatkaX() {

    basic.showIcon(IconNames.Heart)
    switch (smerjizdy) {
        case 1:
            motory(1, 0)
            basic.pause(200)
            stranaOtace = 2
            zatackaPravehoUhlu()

            motory(1, 0)
            basic.pause(500)
            break;
        case 2:
            motory(1, 0)
            basic.pause(200)
            break;
        case 3:
            motory(1, 0)
            basic.pause(200)
            stranaOtace = -2
            zatackaPravehoUhlu()

            motory(1, 0)
            basic.pause(500)
            break
        default:
        // code block
    }



}
//krizovatkaT
function krizovatkaT() {
    switch (orientaceKrizovatkyT) {
        case 1:
            motory(0, 1)
            basic.pause(50)
            motory(1, 0)
            break;
        case 2:
            // code block
            break;
        case 3:
            // code block
            break;
        default:
        // code block
    }
}
//sos tlacitko
input.onButtonPressed(Button.AB, function () {
    PCAmotor.MotorStopAll()

})
//zamek
input.onButtonPressed(Button.A, function () {
    if (zamek) {
        zamek = false
    } else {
        zamek = true
    }

})
// konec cary nebo preruseni
function bezCary() {

    basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . # . .
    . . # . .
    `)
    let Foward = (whiteLine ^ pins.digitalReadPin(pinF)) == 0 ? false : true
    let Left = (whiteLine ^ pins.digitalReadPin(pinL)) == 0 ? false : true
    let Right = (whiteLine ^ pins.digitalReadPin(pinR)) == 0 ? false : true
    motory(2, 0)
    basic.pause(1000)
    if (!Left || !Right || !Foward) {

    } else {
        zatackaPravehoUhlu()
        zatackaPravehoUhlu()
        motory(2, 0)
        basic.pause(1000)
    }
}


function prekazka() {



}
//chat gpt

// interface ObjectValues {
//     forward: 0 | 1;
//     left: 0 | 1;
//     right: 0 | 1;
// }

// function calculateMode(objectArray: Object[]): [number, number, number] {
//     const countMap:any = {
//         forward0: 0,
//         forward1: 0,
//         left0: 0,
//         left1: 0,
//         right0: 0,
//         right1: 0,
//     };

//     for (const obj of objectArray) {
//         countMap[`forward${obj.forward}`]++;
//         countMap[`left${obj.left}`]++;
//         countMap[`right${obj.right}`]++;
//     }

//     let maxCount = 0;
//     let mode: [number, number, number] = [0, 0, 0];

//     for (const key in countMap) {
//         if (countMap.hasOwnProperty(key) && countMap[key] > maxCount) {
//             maxCount = countMap[key];
//             mode = key.split('').map((value) => parseInt(value, 10)) as [number, number, number];
//         }
//     }

//     return mode;
// }


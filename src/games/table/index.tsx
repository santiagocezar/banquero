// import { styled } from 'lib/theme';
// import { FC, FormEvent, useState } from 'react';
// import { Paneled } from 'components/panels';
// import { Swatch, useAddPlayerPanel } from 'components/panels/AddPlayer';
// import { PlayerFor, PlayerID } from 'lib/bx';
// import { AddScore } from './AddScore';
// import { truco } from '.';
// import { palettes } from "lib/color";
// import { Input } from "components/Forms";
// import { HEADER_HEIGHT } from "components/Header";
// import { range } from "lib/utils";
import './style.less'

import { useGameData } from "../../bxx";
import { For, Show, createEffect, createSignal, untrack } from "solid-js";
import * as z from 'zod'
import { range } from "../../lib/utils";


const PadGame = z.object({

}).default({
})
type PadGame = z.infer<typeof PadGame>


export function PadView() {
    const game = useGameData(PadGame)
    let dragging = false
    let bar: HTMLDivElement

    let centerX = 0, centerY = 0, prevX = 1, prevY = 0;

    const [angle, setAngle] = createSignal(0)

    function dragStart(event: MouseEvent) {
        console.log("start")
        dragging = true
        const rect = bar.getBoundingClientRect()
        centerX = rect.x + rect.width / 2,
            centerY = rect.y + rect.height / 2

        console.dir({ centerX, centerY })
    }
    function doTheThing(deltaX: number, deltaY: number) {
        // normalize the delta vector

        // if (deltaX == 0 && deltaY == 0) return;

        // const mod = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

        // deltaX /= mod, deltaY /= mod

        const alpha = Math.atan2(deltaY * prevX - deltaX * prevY, deltaX * prevX + deltaY * prevY)

        prevX = deltaX, prevY = deltaY

        setAngle(a => a + alpha)


        // let alpha = 0;
        // if (deltaY != 0) {
        //     alpha = Math.atan(deltaY / deltaX)
        //     if (deltaX < 0) {
        //         alpha -= Math.PI
        //     }
        //     if (alpha < 0) {
        //         alpha += Math.PI * 2
        //     }
        // }

        // // let betaA = (alpha - angle() % (2 * Math.PI) + Math.PI) % (2 * Math.PI) - Math.PI;

        // const trueAngle = (angle() % (2 * Math.PI) + (2 * Math.PI)) % (2 * Math.PI)
        // const betaA = (alpha - 2 * Math.PI - trueAngle),
        //     betaB = (alpha - trueAngle);

    }
    function debugFormSubmit(e: Event) {
        e.preventDefault()
        if (!(e.target instanceof HTMLFormElement)) return

        const data = new FormData(e.target)
        const x = Number(data.get("x")),
            y = Number(data.get("y"));

        console.log({ x, y })
        doTheThing(x, y)
    }

    function drag(event: MouseEvent) {
        if (!dragging) return


        let deltaX = event.clientX - centerX,
            deltaY = event.clientY - centerY

        doTheThing(deltaX, deltaY)
        console.log("wee")
    }
    function dragEnd() {
        if (dragging) console.log("finish")
        dragging = false
    }

    createEffect(() => {
        bar.animate([
            {
                transform: `rotate(${angle()}rad)`,
            }
        ], {
            duration: 500,
            fill: "forwards",
            easing: "ease"
        })
    })

    return (
        <div class="pad">
            <div class="container" onMouseMove={drag} onMouseUp={dragEnd}>
                <div ref={bar!} class="bar">
                    Santi
                    <div class="ball" draggable onMouseDown={dragStart} >
                    </div>
                </div>
                <div ref={bar!} class="bar">
                    Santi
                    <div class="ball" draggable onMouseDown={dragStart} >
                    </div>
                </div>
            </div>
        </div>
    );
}

# Mobile Draw Fix Notes Tied to Current `Draw.jsx`

## Observed current state

The current draw page:
- uses a `<canvas>`
- registers `pointerdown` and `pointermove`
- listens for `pointerup` on `window`
- computes positions from `clientX/clientY`
- resizes canvas using devicePixelRatio
- does not currently expose explicit mobile touch CSS controls in the component

## Likely causes of mobile failure

1. touch input is being interpreted as page scroll or gesture because `touch-action` is not disabled on the canvas
2. missing pointer capture on `pointerdown`
3. canvas/container overlay or CSS interference on smaller screens
4. device-pixel-ratio scaling and clear/resize interactions are correct enough for desktop but still need mobile verification
5. no explicit handling of `pointercancel`

## Safe fix sequence

1. add CSS:
   - `touch-action: none;`
   - `user-select: none;`
   - `-webkit-user-select: none;`
   - `-webkit-touch-callout: none;`

2. on pointer down:
   - call `canvas.setPointerCapture?.(e.pointerId)`
   - guard for primary pointer only if needed

3. add `pointercancel` cleanup

4. ensure `e.preventDefault()` is used only where needed and compatible with pointer event flow

5. test on:
   - narrow mobile emulation
   - orientation change
   - drag near edges
   - quick taps vs slow strokes

## Regression warning

Do not replace the draw tool with a new implementation unless the minimal patch fails.

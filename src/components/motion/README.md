# Motion components

Adapted from [motion-primitives](https://github.com/ibelick/motion-primitives) by ibelick, used under the MIT licence below.

What changed in the adaptation: imports from `framer-motion` (already a dependency) instead of `motion/react`; no `cn`/shadcn helpers; colours come from the store's theme tokens; mouse-only effects ignore touch; each component respects reduced motion; `TextEffect` can wait until it is scrolled into view while keeping its text in the page for search engines and screen readers; `InfiniteSlider` takes a render function so the duplicate copy stays hidden from assistive tech, and can be paused.

| Component | Used for |
|---|---|
| `TextEffect` | Hero headline and section titles revealing word by word |
| `InView` | Sections fading up as they scroll in |
| `Magnetic` | Primary calls to action drifting towards the cursor |
| `Spotlight` | Soft accent glow following the cursor over product tiles |
| `AnimatedNumber` | Bag, checkout and bundle totals counting to their new value |
| `SlidingNumber` | Bag and wishlist counts in the header |
| `BorderTrail` | Light running around the checkout button |
| `TextShimmer` | "Free shipping unlocked" |
| `InfiniteSlider` | Announcement bar and the product strip |
| `AnimatedBackground` | Sliding highlight behind tabs and checkout steps |
| `TransitionPanel` | Checkout steps sliding between each other |
| `ProgressiveBlur` | Captions over collection cards |
| `ScrollProgress` | Reading progress on journal posts |

## Licence

MIT License

Copyright (c) 2024 ibelick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

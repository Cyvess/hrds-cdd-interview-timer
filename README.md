# HRDS-CDD Interview Timer

Choose a preset or enter any whole number from 1 to 999 minutes, then select **Start timer**. The 3D dial shows how much time remains. Pause and resume with the same button, or use the reset button to restore the selected duration.

## Run locally

Open `index.html` in a browser. The timer runs entirely on the device, with its font, seal, and landscape included in `assets/`. It requires no installation or build step.

## Controls

- **Space** starts, pauses, or resumes the countdown when focus is outside a control.
- **R** resets the countdown when focus is outside a control.
- The play/pause button beside the speaker controls the countdown in both normal and fullscreen views. The speaker toggles the ticking sound for the final five seconds and the alarm at zero. The expand button opens fullscreen in supported browsers.
- The panelist and candidate cats sway while the timer is ready or running and hop twice when time is up. The dial and cats respect the browser’s reduced-motion setting.

## Assets

- The DENR seal is sourced from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Seal_of_the_Department_of_Environment_and_Natural_Resources.svg). The source credits DENR and credits the SVG rendition to Sean Ronquillo.
- The rainforest background and transparent cat illustrations were created for this project with ImageGen. CSS animates the cats in the timer.
- The bundled Geist font is distributed under the [SIL Open Font License](assets/geist-OFL.txt).

<details>
<summary>ImageGen landscape prompt</summary>

> Photorealistic wide-format landscape backdrop for the display panel of a refined environmental timer web app. Elevated view deep into a Philippine tropical rainforest valley at blue hour, layers of misty mountains across the distant horizon, lush dense tropical treetops on the lower left and lower right, with an understated ribbon of river visible through the valley in the lower third. Serene deep navy sky opening through the upper center, muted cyan haze on the horizon, deep jade and teal shadows on the trees, selective silvery highlights. The upper central zone stays spacious and low-contrast, the forest is richer and more textural along the edges and bottom. Soft landscape photography, cinematic atmospheric depth with realistic vegetation, no unnatural bloom. Wide horizontal framing, 16:9 or wider. Edge-to-edge landscape only, no humans, buildings, objects, lettering, watermarks, borders or interface elements.

</details>

<details>
<summary>ImageGen cat prompts</summary>

Each character prompt uses the shared description followed by its role description.

> Stylized-concept, transparent game UI sprite for a countdown timer. Create one appealing full-body anthropomorphic upright cat as a premium little 3D molded vinyl figurine, designer collectible quality, generously oversized rounded head and expressive eyes, compact soft rounded body and short paws. Centered, attractive three-quarter pose, entirety of ears, paws and tail inside frame, compact near-square silhouette, slight eye-level camera, crisp silhouette and bold features legible as a 130-pixel game UI sprite. Carefully tactile satin clay materials with fine natural detailing, soft warm neutral frontal key light and defined subtle contrasting mint/cyan rim-light for a deep teal blue-hour scene; bright enough to pop in a dark interface. True transparent RGBA behind the entire isolated figure. No backdrop, no scenery, no detached floor or floor shadow, no platform/base, no typography or watermark. No human characters or human hands.

**Panelist**

> The cat is an endearing, dignified charcoal-gray cat with a pale muzzle and golden-green eyes, round brass spectacles with clean wire frames, dressed in a deep emerald green office cardigan over a small cream collar. It holds a compact warm brown clipboard neatly against its chest with both soft forepaws, reads as a panel interviewer, and glances to the viewer's right toward the center of the future app.

**Candidate**

> The cat is an endearing ochre-orange and cream tabby with distinct simple stripes, bright amber eyes, dressed in a cobalt blue office jacket with a crisp small white collar. It holds a compact pale cream document folder neatly against its chest with both soft forepaws, reads as a friendly slightly expectant job candidate, and glances to the viewer's left toward the center of the future app.

</details>

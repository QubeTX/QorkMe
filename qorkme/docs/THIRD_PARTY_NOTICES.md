# Third-party notices

## vgpu 0.5.0

Source: <https://github.com/vercel-labs/vgpu>. The verified Holographic Card material supplies diffraction, pearlescence, grain and pointer lighting. QorkMe replaces the card artwork with a font mask, blue-violet base and linked-ring engraving. Verification manifest: `hologram-source.json`. Upstream license from the installed `vgpu/LICENSE`:

```text
MIT License

Copyright (c) 2025 Vercel, Inc.

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
```

## ObsidianUI

Source: <https://gitlab.com/Atharvsinh-codez/ObsidianUI>. Adapted components: Dither Canvas and Arrow Fill Button. Dither uses the character/Bayer pattern and pointer displacement with a procedural moving source instead of a remote video. Button fill/arrow motion is implemented in CSS; labels retain the existing slot roll. Upstream [license](https://gitlab.com/Atharvsinh-codez/ObsidianUI/-/raw/main/LICENSE):

```text
MIT License

Copyright (c) 2026 ObsidianUI

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
```

## Hosted SHAUGHV cursor and dropdowns

The shared [cursor](https://cdn.shaughv.com/cursor) and [dropdown](https://cdn.shaughv.com/dropdowns) implementations are loaded from the canonical SHAUGHV CDN, using the versioned URLs discovered in its live catalog. The cursor derives from emmetts.dev with the shared MCP interaction behavior. QorkMe customizes its base color through the documented API; no third-party script source is copied into this repository.

## Existing QorkMe assets

Makira files are reused in place under their existing license. Paper Mono is bundled under SIL OFL 1.1, with its original copyright and license in `../public/fonts/PaperMono-OFL.txt`. See `../public/fonts/README.md` for font sources and usage. Shared motion and resize helpers retain their existing project ownership.

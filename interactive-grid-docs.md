# React Interactive Grid Pattern
          URL: /background/interactive-grid-pattern
          React interactive grid background with Tron-style hover effects. Smooth 60fps performance and TypeScript integration with shadcn/ui styling.
          title: Trying to implement interactive grids?

Join our Discord community for help
from other developers.

Static grids are boring. CSS-only grids can't track state. You need a grid that responds to users without killing performance. This React component creates an SVG grid where each cell lights up on hover, running at 60fps even with thousands of cells.

Watch grid cells illuminate as you move your cursor:

Built for React and Next.js with full TypeScript support. The grid uses a single SVG element with minimal DOM manipulation, so hover effects stay smooth even on lower-end devices. Works perfectly with shadcn/ui design systems.

Most developers create a div for each cell. Bad move. 400 cells = 400 DOM nodes = sluggish interactions. Others use canvas, which means managing a whole rendering context for what should be a simple hover effect.

This React component uses a single SVG with rect elements. Hover state is tracked with React's useState, but only for active cells. CSS transitions handle the visual changes. Result? Butter-smooth interactions even with 1000+ cells.

Grid with vibrant colors that match your brand:

Different grid styles for various use cases:

Single SVG rendering for thousands of cells without performance penalty

React state tracking only for hovered cells

CSS transition animations running at 60fps

TypeScript definitions for proper IDE support in React projects

Customizable grid density with width/height props

Responsive scaling that adapts to container size

Radial gradient masking for spotlight effects

shadcn/ui compatible using Tailwind CSS classes

Main grid component that handles hover interactions.

Prop

Type

Default

Description

className

string

-

Additional Tailwind CSS classes for SVG

width

number

40

Width of each grid cell in pixels

height

number

40

Height of each grid cell in pixels

squares

[number, number]

[24, 24]

Grid dimensions [columns, rows]

squaresClassName

string

-

Classes for interactive square elements

Too many cells: More than 50x50 grid starts impacting performance. Keep it reasonable—users can't distinguish individual cells beyond that anyway.

Z-index layering: Content needs relative z-10 to appear above the grid. The SVG uses absolute positioning.

Mobile performance: Touch devices don't have hover, so the effect is lost. Consider disabling on mobile or using touch events instead.

Color contrast: Light hover effects get lost on light backgrounds. Use sufficient opacity or color contrast for visibility.

Container sizing: The grid fills its container. Make sure the parent has explicit dimensions or the grid won't render.

Perfect under Particles for layered effects. Combines well with Gradient for depth. The grid is subtle enough to work behind any shadcn/ui component without competing for attention.

Pass a custom squaresClassName with your Tailwind classes. Use hover:fill-blue-500 or whatever color you want. The default uses fill-neutral-600.

Yes, add onClick to the rect elements in the component. Each cell can have its own handler. Track clicked cells in state if you need persistent selection.

Technically unlimited, but practically around 2500 cells (50x50). Beyond that, hover performance degrades. For larger grids, consider virtualizing or using canvas.

The transition duration is set in CSS. Find the transition-all duration-300 and change to duration-150 for snappier response.

You'd need to modify the SVG structure. Hexagons require different path calculations. Triangles are easier—just rotate squares 45 degrees and clip.

Track mouse position and calculate distance from each cell. Apply opacity based on distance. Performance-intensive but doable for smaller grids.
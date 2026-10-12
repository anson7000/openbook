## Goals
- Make a cheat sheet editor.
- The cheat sheet editor uses Binary Space Partition (BSP) tiling to cerate mutiple tiles on an  A4-sized canvas
- Each tile is a Tiptap editor
- User can drag the hyperplane to resize
- User can export the cheat sheet as a pdf file, the pdf file must be a4-size
- User can zoom in and out in the canvas
- User can change the orientation of the page
- User click on the tile to select the tile and start editing

## Components
- Canvas: Holds the Page component
- Page: Holds the Tile components
- Tile: Holds the Tiptap editor 

## Style
- No need styling
- No margins between tiles
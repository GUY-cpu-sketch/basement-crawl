# Basement Crawl

An original, touch-first roguelite dungeon crawler for iOS and web.

Development: open index.html in a browser or serve the repository with a static HTTP server.

Controls are detected automatically per device: PC (WASD move, arrow keys shoot, B bomb), touch (left stick moves, right stick aims and fires, on-screen bomb button) and controller (left stick move, right stick aim/fire, B bomb). The scheme follows the last device used, and src/input.js normalises all three into one input frame.

Architecture: src/game.js game loop; src/input.js device-aware control schemes; src/player.js player; src/enemies.js AI; src/items.js item pool; src/rooms.js procedural rooms; src/floors.js progression; src/combat.js projectiles; src/rendering.js canvas renderer; ios/ iOS notes; .github/workflows/ CI.

All game content is original and intended as an independent project, not a copy of another game's assets or code.


GUY-cpu-sketch.github.io

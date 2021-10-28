> NOTE - This is a WIP, and is intended as a tech demo only. Use this to understand how to structure your project with the following stack - 


# Overview

https://user-images.githubusercontent.com/14075632/139267793-56c13afe-917c-4b54-b087-b966c388fb44.mp4


An full demo, on how to build a basic zombie survival multiplayer IO game, including -

- Phaser running on the client, and server side
- Full typescript support across server and client
- Mutliplayer networking powered by nengijs - https://github.com/timetocode/nengi
- UI powered by react + redux

## Structure

**Frontend**
- Create react app (typescript)
- Redux local state
  - Tailwind + styled components for styling
- Phaser for UI
  - Demo contains tilemap, collissions, bullets, player movement, basic bot AI
- Nengi for multiplayer networking

**Backend**
- Authorative server, all movement, collisions etc calculated here
- Communication with frontend powered by nengi
- Full typescript support
- Winston logging

**Common**
- Define re-useable data between frontend / backend (for example types, messages, entities etc)
## Getting started

## How to run it

My development flow is as follows -
- Open `frontend` folder, run `yarn start`
- Open `server` folder, run `yarn debug`

Set aliases -

2dfrontend='z /home/wsl-tom/git/side-projects/2d-shooter-2020-nengi-port/frontend && yarn start'
2dserver='z /home/wsl-tom/git/side-projects/2d-shooter-2020-nengi-port/server && yarn debug'

They should now both automatically hot reload whenever you make a relevant change in the `frontend` / `server` directory.

You can open a single instance of VS code at the root directory (I.E at the same level as this README), and development should work correctly.

If you'd like to debug either the server or frontend via VS code, you should open that folder on its own, and you'll then be able to make use of the debug scripts defined in `launch.json` in each folder (already configured - just press F5 in VS Code, and it will start a server you can add debugging points, or open a chrome instance you can set debugging points in)

Currently changes to common require a manual reload on `server` - fix will come soon for this / feel free to open a PR

WIP
- Add client side prediction (simple providing your movement is deterministic on the server, will add example soon)

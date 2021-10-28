> NOTE - This is a WIP. Its intended purpose is to help understand how you can use a variety of web technologies, to build a multiplayer game from scratch.
>  PR's to extend this demo, or improve the structure are most appreciated.

> NengiJS supports node V14.15.4 LTS or under currently ([See the following thread](https://discord.com/channels/429705662944247810/429711247513223190/803290730235166790)), therefore
> please ensure you're using an appropiate version

# Overview


https://user-images.githubusercontent.com/14075632/139271621-1b3cc9a7-63ae-4fd0-93e9-a0932a42877a.mp4

https://user-images.githubusercontent.com/14075632/139267793-56c13afe-917c-4b54-b087-b966c388fb44.mp4


A full demo project, which shows how to build a basic zombie survival multiplayer IO game, including -

- [Phaser](https://phaser.io/) running on the client, and server side
- Full typescript support across server and client
- Mutliplayer networking powered by [nengi.js](https://www.npmjs.com/package/nengi)
- UI powered by [React + Redux](https://reactjs.org/docs/create-a-new-react-app.html)

## Game Details

- Survive upto X rounds, against increasing horde sizes (all [configurable here](https://github.com/TomYeoman/2d-zombie-survival-io-demo/blob/main/server/src/config/zombie_config.ts#L3))
- All dead players, will spawn at the start of each new round
- Once all players are dead, game will restart

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

Reccomended aliases -

- 2dfrontend='z path-to-project/frontend && yarn start'
- 2dserver='z path-to-project/server && yarn debug'

They should now both automatically hot reload whenever you make a relevant change in the `frontend` / `server` directory.

You can open a single instance of VS code at the root directory (I.E at the same level as this README), and development should work correctly.

If you'd like to debug either the server or frontend via VS code, you should open that folder on its own, and you'll then be able to make use of the debug scripts defined in `launch.json` in each folder (already configured - just press F5 in VS Code, and it will start a server you can add debugging points, or open a chrome instance you can set debugging points in)

Currently changes to common require a manual reload on `server` - fix will come soon for this / feel free to open a PR

WIP
- Add client side prediction (simple providing your movement is deterministic on the server, will add example soon)

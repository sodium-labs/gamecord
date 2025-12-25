<div align="center">
<br />
    <h1>Gamecord</h1>
    <br />
    <p>
        <a href="https://discord.gg/8PDXWSHH7k"><img src="https://img.shields.io/discord/1336303640725553213?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
        <a href="https://www.npmjs.com/package/@sodiumlabs/gamecord"><img src="https://img.shields.io/npm/v/@sodiumlabs/gamecord.svg?maxAge=3600" alt="npm version" /></a>
        <a href="https://www.npmjs.com/package/@sodiumlabs/gamecord"><img src="https://img.shields.io/npm/dt/@sodiumlabs/gamecord.svg?maxAge=3600" alt="npm downloads" /></a>
        <a href="https://github.com/sodium-labs/gamecord/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/sodium-labs/gamecord?logo=github&logoColor=ffffff" /></a>
    </p>
</div>

# About

### Gamecord is a collection of games for your Discord bot.

This library was made as a replacement for [discord-gamecord](https://www.npmjs.com/package/discord-gamecord) which is unmaintained (and partially broken) and has no TypeScript support. While the games options are mostly similar, they are more different as they offers more features to customize and handle your games. Also, this module does not contains all games of the original.

Each games are documented with examples on the documentation: TODO

# Installation

### Node.js 18 or newer is required.

```
npm install @sodiumlabs/gamecord
```

# Example usage

TODO

# Some previews

<img src="./.github/images/2048.png" alt="2048 game" width="300">
<img src="./.github/images/connect4.png" alt="connect4 game" width="300">
<img src="./.github/images/flood.png" alt="flood game" width="300">
<img src="./.github/images/memory.png" alt="memory game" width="300">
<img src="./.github/images/minesweeper.png" alt="minesweeper game" width="300">
<img src="./.github/images/rockpaperscissors.png" alt="rockpaperscissors game" width="300">
<img src="./.github/images/tictactoe.png" alt="tictactoe game" width="300">
<img src="./.github/images/trivia.png" alt="trivia game" width="300">
<img src="./.github/images/wordle.png" alt="wordle game" width="300">

# Notes

- The module expects you to pass function that will not error. If it does, the games can break (e.g. by never emitting the `end` or `gameOver` event).
- If you dont use `.on("error")`, errors will emit `uncaughtException` on your process.
- Every components custom ids starts with `$gamecord-`.
- Most games dont need any permissions since it relies on the interaction methods. However if the game is too long (>= 15mins), the interaction became invalid and the bot will need to be able to see the channel and edit its messages.

# Links

TODO

# Help

You need help with the module? Ask on our [support server!](https://discord.gg/8PDXWSHH7k)

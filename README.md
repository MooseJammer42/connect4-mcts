# Connect Four with Monte Carlo Tree Search

A Connect 4 game that uses Monte Carlo Tree Search (MCTS) for the AI opponent, with both a web GUI and terminal interface.

## Features

- **Monte Carlo Tree Search AI**: Intelligent opponent using MCTS algorithm
- **Web GUI Interface**: Play in your browser with no API calls - everything runs client-side in JavaScript
- **Customizable Board Size**: Play on any board size (web GUI restricted to 30x30 max)
- **Customizable Difficulty**: MCTS is great for easily incrementing difficulty. Just add more simulations!
- **Terminal Play**: Includes [main_cli.js](main_cli.js) for command-line gameplay
- **Pure JavaScript**: Runs entirely in the browser

## Getting Started

### If My WebSite Works
https://c4.walstrom.org

### Web GUI
1. Start the server: `node server.js`
2. Open your browser to the local server
3. Play against the MCTS AI

### Terminal
Run `node main_cli.js` to play in the terminal.

Note: The CLI version is missing some features and might even be unusable at this point. Check out the Python version for full functionality and additional debugging tools.


## Resources

- [Reducing the Burden of Knowledge - AI Factory](https://www.aifactory.co.uk/newsletter/2013_01_reduce_burden.htm)

## Future Plans

Lecture material and additional documentation may be added in the future.
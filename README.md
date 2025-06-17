# MyVibe

MyVibe is a small experiment for collecting quick sentiment from users. A Node.js server stores submissions in a SQLite database while a browser extension and embeddable web plugin allow users to report whether their day is "Great", "Meh" or "Ugh". A simple dashboard displays aggregated counts in real time.

## Stack

- **Server**: Node.js with Express, Socket.io and SQLite.
- **Extension**: Chrome extension built with Webpack.
- **Web Plugin**: Stand‑alone JavaScript widget (`plugin/myvibe-plugin.js`).
- **Dashboard**: Static HTML/JS served from `server/src/public` using Chart.js.

## Installation

1. **Server**
   ```bash
   cd server
   npm install
   npm run init-db   # create the SQLite database
   ```
2. **Chrome Extension** (optional)
   ```bash
   cd ../extension
   npm install
   npm run build     # outputs to extension/dist
   ```
   Load the generated `dist` folder in Chrome's extensions page (developer mode).
3. **Web Plugin** (optional)
   Copy `plugin/myvibe-plugin.js` to any web page and initialize it as shown in `plugin/sample.html`.

## Running

Start the backend API:

```bash
cd server
npm start
```

The server listens on port `3000`. Visit `http://localhost:3000` to view the dashboard. The extension or web plugin will communicate with the API at `/api` on the same port.

## License

This project is for non-commercial use only. No part of the repository may be used, copied or distributed without the express consent of **Nikhil Kodilkar**.

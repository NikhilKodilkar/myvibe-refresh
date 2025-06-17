# Plan to Integrate New UI into Server Backend

This document outlines the steps required to integrate the React/TypeScript UI located in `server/new-ui-backend` with the existing Express server.

## 1. Review New UI
- Built with Vite, React, Tailwind, shadcn-ui and uses Supabase for data access.
- `npm run dev` starts a dev server on port 8080.
- `npm run build` outputs static files to `dist/`.

## 2. Install Dependencies
Inside `server/new-ui-backend` run:
```bash
npm install
```
This installs all packages defined in `package.json`.

## 3. Build Process
Create a build step that compiles the UI before starting the backend:
```bash
cd server/new-ui-backend
npm run build
```
The compiled files will be placed in `server/new-ui-backend/dist`.

## 4. Serve Built Assets from Express
Update the Express app (`server/src/index.js`) to serve the compiled `dist` folder:
```javascript
app.use(express.static(path.join(__dirname, '..', 'new-ui-backend', 'dist')));
```
This allows `http://<server>:3000` to render the React app after it has been built.

## 5. Replace Supabase Calls
The UI currently fetches data directly from Supabase (see `src/integrations/supabase`). To use the existing SQLite database:
1. Expose REST endpoints from Express that return the same data the UI expects (e.g. list of users, sentiments for a given time range).
2. Replace the Supabase client in `src/hooks/useSentimentData.ts` with `fetch` calls to these endpoints.
3. Optionally keep Supabase support via environment variables if remote storage is preferred.

## 6. Database Alignment
- Ensure the SQLite schema (`server/src/db/schema.sql`) matches the tables used in the UI (`users` and `sentiments`).
- Seed sample data using `server/src/db/dummy-data.ddl` or convert Supabase migrations if needed.

## 7. Development Workflow
For local development, run the Express server and Vite dev server concurrently:
```bash
# Terminal 1
cd server && npm run dev
# Terminal 2
cd server/new-ui-backend && npm run dev
```
When ready for production, build the UI and start the Express server only.

## 8. Future Enhancements
- Add a script in `server/package.json` such as `npm run build-ui` to automate the build step.
- Consider Dockerizing the combined app for easier deployment.
- Implement environment variables to toggle between SQLite and Supabase.


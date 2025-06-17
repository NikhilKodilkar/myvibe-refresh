# MyVibe Web Plugin

This JavaScript plugin provides the same functionality as the original Chrome extension. It can be embedded in any web page to allow users to register/login and submit their daily sentiment.

## Usage

1. Copy `myvibe-plugin.js` to a location that can be served from your website.
2. Include the script on your page and initialize the plugin:

```html
<script src="/path/to/myvibe-plugin.js"></script>
<script>
  // Configure the API base URL if your MyVibe server runs elsewhere
  new MyVibePlugin({ apiBase: 'http://localhost:3000/api' });
</script>
```

The plugin automatically creates a small widget in the bottom-right corner of the page. Users can register or login and send their current vibe (Great, Meh or Ugh). The registration information is stored in `localStorage` so it persists across visits.

## Sample

See `sample.html` in this directory for a minimal example page that loads the plugin.

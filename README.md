# Nav Arrows

Navigate back and forward with arrows in the top bar, right next to the sidebar collapse button.

## Features

- Navigation arrows always visible regardless of sidebar state
- Arrows are disabled when there is no back or forward history
- Matches Obsidian's native icon style

## Installation

### From Community Plugins

1. Open **Settings → Community plugins**
2. Search for **Nav Arrows**
3. Install and enable the plugin

### Manual

1. Download `main.js`, `manifest.json`, and `styles.css` from the [latest release](https://github.com/AntoineArt/obsidian-nav-buttons/releases/latest)
2. Create a folder `.obsidian/plugins/nav-arrows/` in your vault
3. Place the files inside it
4. Enable the plugin in **Settings → Community plugins**

## Publishing

Community plugins are submitted through the [Obsidian Community developer dashboard](https://community.obsidian.md), not via pull requests to `obsidian-releases`.

Before submitting or releasing:

1. Validate locally with `npm run lint`
2. Create a GitHub release whose tag matches `manifest.json`
3. Attach `main.js`, `manifest.json`, and `styles.css` to the release

## License

MIT

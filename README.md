# Figma Design Inspector for Figma

A powerful developer-focused Figma plugin that provides detailed inspection capabilities for design elements, similar to browser developer tools.

## Features

- 🔍 Inspect selected elements:
  - Node name and type
  - Dimensions and position
  - Text properties (font, size, weight, etc.)
  - Shape properties (fill color, border radius)
  - Padding and margin information
- 📏 Measure spacing between multiple selected elements
- 💻 Export to CSS or Tailwind classes
- 🌓 Dark/Light mode support
- 🎨 Clean, modern UI

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma desktop app:
   - Go to Plugins > Development > Import plugin from manifest
   - Select the `manifest.json` file from this project

## Development

- Run `npm run watch` to start TypeScript compiler in watch mode
- Make changes to the code
- Reload the plugin in Figma to see changes

## Usage

1. Select one or more elements in your Figma design
2. Open the Figma Design Inspector
3. View detailed information about the selected elements
4. Switch between CSS and Tailwind output using the tabs
5. Toggle dark/light mode using the theme button

## Building for Production

1. Run the build command:
   ```bash
   npm run build
   ```
2. The compiled files will be ready for distribution

## License

MIT License - feel free to use this plugin in your projects! 
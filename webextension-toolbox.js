// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
const GlobEntriesPlugin = require('webpack-watched-glob-entries-plugin')
const { resolve } = require('path')

module.exports = {
  webpack: (config, { dev, vendor }) => {
    // Perform customizations to webpack config
    // Automatically resolve the following extensions:
    config.resolve = {
      extensions: ['.js', '.json', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts']
    }

    /******************************/
    /*       WEBPACK.ENTRY        */
    /******************************/
    const entries = []

    // Add main entry glob
    entries.push(resolve('app', '*.{ts,tsx,js,mjs,jsx}'))
    entries.push(resolve('app', '?(scripts)/*.{ts,tsx,js,mjs,jsx}'))

    // We use the GlobEntriesPlugin in order to
    // restart the compiler in watch mode, when new
    // files got added.
    config.entry = GlobEntriesPlugin.getEntries(
      entries
    )

    /*       WEBPACK.LOADERS      */
     /******************************/
     // Add typescript support
     config.module.rules.push({
       test: /\.(ts|tsx)$/,
       exclude: /node_modules/,
       use: 'ts-loader'
     })
    // Important: return the modified config
    return config
  }
}

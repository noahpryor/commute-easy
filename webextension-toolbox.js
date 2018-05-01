// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)
const { resolve } = require("path");
const webpack = require("webpack");
const GlobEntriesPlugin = require("webpack-watched-glob-entries-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const dotenv = require("dotenv");

dotenv.config();

// This is incredibly brittle but currently its the only plugin without its own name
const isCopyPlugin = plugin => plugin.constructor.name === "Object";

module.exports = {
  webpack: (config, { dev, vendor }) => {
    // Perform customizations to webpack config
    // Automatically resolve the following extensions:
    config.resolve = {
      extensions: [".js", ".json", ".mjs", ".jsx", ".ts", ".tsx", ".d.ts"],
    };

    const src = "app";
    /******************************/
    /*       WEBPACK.ENTRY        */
    /******************************/
    const entries = [];

    // Add main entry glob
    // entries.push(resolve('app', '*.{ts,tsx,js,mjs,jsx}'))
    entries.push(resolve(src, "?(scripts)/*.{ts,tsx,js,mjs,jsx}"));

    // We use the GlobEntriesPlugin in order to
    // restart the compiler in watch mode, when new
    // files got added.
    config.entry = GlobEntriesPlugin.getEntries(entries);

    // original: https://git.io/vp04H
    // Replace CopyPlugin with one that ignores typescript files as well
    //
    const copyPluginIndex = config.plugins.findIndex(isCopyPlugin);

    config.plugins.splice(
      copyPluginIndex,
      1,
      new CopyPlugin([
        {
          // Copy all files except (.js, .json, _locales)
          context: resolve(src),
          from: resolve(src, "**/*"),
          ignore: ["**/*.js", "**/*.json", "**/*.ts", "**/*.tsx"],
          to: config.output.path,
        },
        {
          // Copy all language json files
          context: resolve(src),
          from: resolve(src, "_locales/**/*.json"),
          to: config.output.path,
        },
      ])
    );

    /*       WEBPACK.LOADERS      */
    /******************************/
    // Add typescript support
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: "ts-loader",
    });

    // Set environment vars
    config.plugins.push(
      new webpack.EnvironmentPlugin({
        TRAVELTIME_API_KEY: process.env.TRAVELTIME_API_KEY,
        TRAVELTIME_APP_ID: process.env.TRAVELTIME_APP_ID,
      })
    );
    // Important: return the modified config
    return config;
  },
};

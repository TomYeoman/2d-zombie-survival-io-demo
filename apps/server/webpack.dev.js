/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  target: "node",
  entry: ["./src/server.ts"],
  output: {
    publicPath: "",
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    chunkFilename: "[name].chunk.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        /* options: {
          presets: [
            ["@babel/preset-env"],
            ["@babel/preset-react"]
          ]
        } */
      },
    ],
  },
  externals: [nodeExternals()],
};

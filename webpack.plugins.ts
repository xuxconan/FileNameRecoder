import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import VueLoaderPlugin from "vue-loader/dist/plugin";
import fs from "node:fs";
import dotenv from "dotenv";
import { DefinePlugin } from "webpack";

const appEnv = process.env.APP_ENV;
const envPath = `./.env.${appEnv}`;
const envConfig: any = {};
if (appEnv && fs.existsSync(envPath)) {
  const result = dotenv.config({ path: envPath });
  const { error, parsed } = result;
  if (error) console.error(error)
  else if (parsed) Object.assign(envConfig, parsed);
  console.log("env", parsed, error, envConfig);
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

export const plugins = [
  new DefinePlugin(envConfig),
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new VueLoaderPlugin()
];

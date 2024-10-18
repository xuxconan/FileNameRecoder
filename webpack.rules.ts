import type { ModuleOptions } from 'webpack';

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
      },
    },
  },
  {
    test: /\.vue$/, // 解析vue文件
    exclude: /(node_modules|\.webpack)/,
    loader: 'vue-loader'
  },
  {
    test: /\.scss$/, // 解析scss文件
    exclude: /(node_modules|\.webpack)/,
    use: [
      // 将js字符串生成为style节点
      "style-loader",
      // 将css转化为CommonJS模块
      "css-loader",
      // 将sass编译成css
      "sass-loader",
    ]
  },
];

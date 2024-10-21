module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
    "plugin:vue/vue3-essential",
    "@vue/typescript/recommended",
  ],
  settings: {
    "import/resolver": {
      alias: {
        map: [["@", "./src"]],
        extensions: [".tsx", ".ts", ".jsx", ".js", '.css'],
      }
    }
  },
  parser: "@typescript-eslint/parser",
  rules: {
    //
  },
}

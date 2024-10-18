import fs from "node:fs";
import { glob } from "glob";

const dirs = glob.sync("./src/pages/*")
  .filter((dir) => fs.existsSync(`${dir}/preload.ts`));
const names = dirs.map((dir) => dir.split("/").slice(-1)[0]);

export const entryPoints = names.map((name, index) => {
  const dir = dirs[index];
  const preloadPath = `${dir}/preload.ts`;
  const renderPath = `${dir}/index.ts`;
  const htmlPath = `${dir}/index.html`;
  const entry: any = { name, preload: { js: preloadPath } };
  if (fs.existsSync(renderPath)) entry.js = renderPath;
  if (fs.existsSync(htmlPath)) entry.html = htmlPath;
  return entry;
});

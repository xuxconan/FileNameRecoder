import { app } from 'electron';
import fs from "fs";
import path from "path";

import { Converter } from "../../common";

type IAppPath = 'home' | 'appData' | 'userData' | 'sessionData' | 'temp' | 'exe' | 'module' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'recent' | 'logs' | 'crashDumps'

export default class AppData {
  converter: Converter;
  fileDir: string;
  filePath: string;
  loadId: number;

  json?: any;
  loadPromise?: Promise<any>;
  afterLoaded?: {}[]

  constructor(
    pathName: IAppPath,
    fileName: string
  ) {
    const fileDir = app.getPath(pathName);
    const filePath = path.join(fileDir, fileName);
    this.fileDir = fileDir;
    this.filePath = filePath;
    this.loadId = -1;
    this.converter = new Converter();
  }

  async Load(): Promise<any> {
    this.loadId += 1;
    const filePath = this.filePath;
    if (!fs.existsSync(filePath)) {
      this.json = undefined;
      this.loadPromise = undefined;
      return undefined;
    }
    const self = this;
    const loadId = this.loadId;
    const converter = this.converter;
    const promise = (async () => {
      const data = fs.readFileSync(filePath);
      const json = await converter.BinaryToJson(data);
      if (loadId !== self.loadId)
        return self.loadPromise ? self.loadPromise : self.json;
      self.json = json;
      self.loadPromise = undefined;
      return self.json;
    })();
    this.loadPromise = promise;
    return promise;
  }

  async Read(key?: string) {
    if (!this.json) await this.Load();
    const json = this.json;
    return key ? json[key] : json;
  }

  async Write(value: any, key?: string) {
    if (!this.json) await this.Load();
    const json = this.json ?? {};
    if (key)
      json[key] = value;
    else if (value && typeof value === "object")
      Object.assign(json, value);
    const fileDir = this.fileDir;
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);
    const filePath = this.filePath;
    const converter = this.converter;
    const buffer = await converter.JsonToBinary(json);
    return await fs.writeFileSync(filePath, buffer);
  }
}

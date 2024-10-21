export default class Converter {
  async BinaryToJson(data: Buffer) {
    const str = data.toString("utf8");
    return JSON.parse(str);
  }

  async JsonToBinary(json: string) {
    const str = JSON.stringify(json);
    return Buffer.from(str, "utf8");
  }
}

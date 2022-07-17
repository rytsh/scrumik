import { uniqueNamesGenerator, type Config, colors, animals } from "unique-names-generator";

const customConfig: Config = {
  dictionaries: [colors, animals],
  separator: "-",
  length: 2,
};

const generateName = () => uniqueNamesGenerator(customConfig); // big-donkey

export { generateName };

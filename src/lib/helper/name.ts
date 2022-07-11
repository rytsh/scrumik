import { uniqueNamesGenerator, type Config, adjectives, starWars } from "unique-names-generator";

const customConfig: Config = {
  dictionaries: [adjectives, starWars],
  separator: "-",
  length: 2,
};

const generateName = () => uniqueNamesGenerator(customConfig); // big-donkey

export { generateName };

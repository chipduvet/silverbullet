import { YAML } from "$common/deps.ts";

globalThis.syscall = (name: string, ...args: readonly any[]) => {
  switch (name) {
    case "yaml.parse":
      return Promise.resolve(YAML.load(args[0]));
    case "system.applyAttributeExtractors":
      return Promise.resolve({});
    default:
      throw Error(`Not implemented in tests: ${name}`);
  }
};

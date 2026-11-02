import { register } from "@tokens-studio/sd-transforms";
import StyleDictionary from "style-dictionary";
import { readFile } from "node:fs/promises";

register(StyleDictionary);

/**
 * CSS `font` shorthand cannot express letter-spacing. The spacing stays on
 * `--font-letter-spacing-*`, so the composite typography tokens stay valid
 * shorthand and Style Dictionary reports zero warnings.
 */
StyleDictionary.registerPreprocessor({
  name: "typography-letter-spacing",
  preprocessor: (dictionary) => {
    const visit = (node: unknown) => {
      if (!node || typeof node !== "object") return;
      const record = node as Record<string, unknown>;
      if (record.$type === "typography" && record.$value && typeof record.$value === "object") {
        delete (record.$value as Record<string, unknown>).letterSpacing;
      }
      for (const value of Object.values(record)) visit(value);
    };
    visit(dictionary);
    return dictionary;
  },
});

const themes = JSON.parse(await readFile(new URL("./tokens/$themes.json", import.meta.url), "utf8")) as Array<{
  name: string;
  selectedTokenSets: Record<string, string>;
}>;

for (const theme of themes) {
  const sd = new StyleDictionary({
    source: Object.entries(theme.selectedTokenSets)
      .filter(([, status]) => status !== "disabled")
      .map(([set]) => `tokens/${set}.json`),
    preprocessors: ["tokens-studio", "typography-letter-spacing"],
    log: {
      warnings: "error",
      verbosity: "default",
    },
    platforms: {
      css: {
        transformGroup: "tokens-studio",
        transforms: ["name/kebab"],
        buildPath: "src/styles/",
        files: [
          {
            destination: theme.name === "Light" ? "tokens.css" : "tokens.dark.css",
            format: "css/variables",
            options: {
              selector: theme.name === "Light" ? ":root" : '[data-theme="dark"]',
              outputReferences: true,
            },
          },
        ],
      },
    },
  });

  await sd.buildAllPlatforms();
}

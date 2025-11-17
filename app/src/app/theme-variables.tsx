import tokens from "@/design-system/tokens.json";

const toVarName = (token: string) =>
  token
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();

const buildPrimitiveBlock = () => {
  const radius = Object.entries(tokens.primitives.radii).map(
    ([name, value]) => `  --radius-${toVarName(name)}: ${value};`
  );

  const shadows = Object.entries(tokens.primitives.shadows).map(
    ([name, value]) => `  --shadow-${toVarName(name)}: ${value};`
  );

  return `:root {\n${[...radius, ...shadows].join("\n")}\n}`;
};

const buildThemeBlocks = () =>
  Object.entries(tokens.themes)
    .map(([themeName, values]) => {
      const selector =
        themeName === "dark"
          ? `:root, [data-theme="${themeName}"]`
          : `[data-theme="${themeName}"]`;

      const declarations = Object.entries(values)
        .map(
          ([tokenName, value]) =>
            `  --color-${toVarName(tokenName)}: ${value};`
        )
        .join("\n");

      return `${selector} {\n${declarations}\n}`;
    })
    .join("\n\n");

const themeCss = `${buildPrimitiveBlock()}\n\n${buildThemeBlocks()}`;

export function ThemeVariables() {
  return (
    <style
      id="theme-variables"
      dangerouslySetInnerHTML={{ __html: themeCss }}
    />
  );
}

/**
 * @type {import('prettier').Options}
 */
module.exports = {
    printWidth: 100,
    tabWidth: 4,
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: "none",
    bracketSpacing: true,
    bracketSameLine: true,
    plugins: [
        require.resolve("@plasmohq/prettier-plugin-sort-imports"),
        "prettier-plugin-svelte"
    ],
    importOrder: ["^@plasmohq/(.*)$", "^~(.*)$", "^[./]"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    overrides: [{ files: "*.svelte", options: { parser: "svelte" } }]
};

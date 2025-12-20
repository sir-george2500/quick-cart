module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
  plugins: [
    // Transform import.meta.env to process.env for Jest
    function transformImportMeta() {
      return {
        visitor: {
          MetaProperty(path) {
            if (
              path.node.meta.name === "import" &&
              path.node.property.name === "meta"
            ) {
              // Replace import.meta with a mock object
              path.replaceWithSourceString(
                '({ env: { VITE_API_BASE_URL: "http://localhost:3000/api/v1" } })'
              );
            }
          },
        },
      };
    },
  ],
};

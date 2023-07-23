import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: ["src/graphql/**/*.ts"],
  ignoreNoDocuments: true, // Better experience with watcher.
  generates: {
    "src/generated/": {
      preset: "client",
      plugins: [],
    },
  },
}

export default config

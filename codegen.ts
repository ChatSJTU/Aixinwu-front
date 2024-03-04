
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: "graphql/**/*.graphql",
  ignoreNoDocuments: true,
  generates: {
    "src/graphql/hooks.tsx": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"]
    }
  }
};

export default config;

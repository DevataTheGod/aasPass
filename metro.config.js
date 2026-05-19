const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// @sentry/react-native uses `import { __awaiter } from "tslib"` which Metro
// resolves via tslib's "exports" field to modules/index.js. That file does
// `import tslib from '../tslib.js'` and destructures helpers — breaking Metro's
// CJS→ESM interop. Resolving tslib directly to its CJS file fixes this.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib') {
    return {
      type: 'sourceFile',
      filePath: require.resolve('tslib'),
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;

const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project root
const projectRoot = __dirname;

// Get the default config
const config = getDefaultConfig(projectRoot);

// For monorepo support, watch the workspace root
const workspaceRoot = path.resolve(projectRoot, "..");
config.watchFolders = [workspaceRoot];

// Tell Metro where to resolve packages
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

module.exports = config;

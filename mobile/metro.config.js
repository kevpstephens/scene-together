const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

// Find the project root
const projectRoot = __dirname;

// Get the default config
const config = getDefaultConfig(projectRoot);

// Workspace root (monorepo)
const workspaceRoot = path.resolve(projectRoot, "..");

// Ensure Metro can find deps in both app and workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, "node_modules/react"),
  "react-native": path.resolve(projectRoot, "node_modules/react-native"),
  "react-native-web": path.resolve(
    projectRoot,
    "node_modules/react-native-web"
  ),
};

// Watch both app and workspace so symlinked deps resolve, but force React from app
config.watchFolders = [projectRoot, workspaceRoot];

module.exports = config;

// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

module.exports = config;

// Several chain libs (@ton/crypto, ethers, tronweb, ethereum-cryptography)
// bundle their own copy of @noble/hashes, whose package.json "exports" map
// resolves ./crypto.js to a Node-targeted file expecting Node's `crypto`
// module — which doesn't exist in Hermes, causing "undefined is not a
// function" at import time. Disabling package-exports resolution makes
// Metro fall back to main/browser fields instead, which resolve correctly
// on React Native. Known issue with @noble/hashes + Metro + Expo.
config.resolver.unstable_enablePackageExports = false;

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
  events: require.resolve('events'),
};
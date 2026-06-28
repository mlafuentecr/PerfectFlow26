const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

module.exports = function withModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      const podfile = fs.readFileSync(podfilePath, 'utf8');

      if (!podfile.includes('use_modular_headers!')) {
        const marker = 'prepare_react_native_project!';
        const replacement = `${marker}\nuse_modular_headers!`;
        fs.writeFileSync(podfilePath, podfile.replace(marker, replacement));
      }

      return config;
    },
  ]);
};

// TODO: remove this once migrated to a bundler (e.g. rollup)
const { exec } = require('child_process');
const { version } = require('./package.json');

const versionFile = `export const SDK_VERSION = '${version}';`;

exec(`rm -f version.ts && echo "${versionFile}" > version.ts`);

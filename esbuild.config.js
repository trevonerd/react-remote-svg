const { build } = require('esbuild');
const pkg = require('./package.json');
const fs = require('fs');

const options = {
  entryPoints: ['src/index.tsx'],
  distFolder: './dist',
};

const shared = {
  bundle: true,
  entryPoints: options.entryPoints,
  // Treat all dependencies in package.json as externals to keep bundle size to a minimum
  external: Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {})),
  logLevel: 'info',
  minify: false,
  sourcemap: false,
};

build({
  ...shared,
  format: 'esm',
  outfile: `${options.distFolder}/index.mjs`,
  target: ['esnext', 'node18'],
  plugins: [esbuildPluginTypes()],
});

build({
  ...shared,
  format: 'cjs',
  outfile: `${options.distFolder}/index.js`,
  target: ['esnext', 'node18'],
  plugins: [],
});

function esbuildPluginTypes() {
  return {
    name: 'generate-types',
    setup(build) {
      build.onEnd(() => {
        require('child_process').exec('tsc --project tsconfig.declarations.json --pretty', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error generating TypeScript declaration files: ${stdout}`);
            return;
          }
          if (stderr) {
            console.error(`Error generating TypeScript declaration files: ${stderr}`);
            return;
          }
          console.log('TypeScript declaration files generated successfully');
        });
      });
    },
  };
}

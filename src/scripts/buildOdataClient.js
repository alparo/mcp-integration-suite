import { generate } from '@sap-cloud-sdk/generator';

// Create your options, adapt the input & output directory as well as the package name according to your setup.
const input = 'resources/service-specs';
const outputDir = 'src/generated';

// Create your project datastructure with all sourcefiles based on your options
const generatorConfig = {
  overwrite: true,
  transpile: false,
  readme: false,
  clearOutputDir: true,
  skipValidation: true,
  generateTypedocJson: false,
  packageJson: false
  /* optional:
    optionsPerService: 'test/directory',
    include: 'glob of files to include'
  */
};

// generate your project, you can also redefine options
generate({
  ...generatorConfig,
  input,
  outputDir
});
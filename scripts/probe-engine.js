const fs = require('fs');
const path = require('path');
const wasm = require('@imagemagick/magick-wasm');

function probeEngine() {
  const imgDesc = Object.getOwnPropertyDescriptors(wasm.MagickImage.prototype);
  const methods = Object.keys(imgDesc).filter(
    (k) => typeof imgDesc[k].value === 'function' && !k.startsWith('_')
  ).sort();

  const properties = Object.keys(imgDesc).filter(
    (k) => !!imgDesc[k].get && !k.startsWith('_')
  ).sort();

  const colDesc = Object.getOwnPropertyDescriptors(wasm.MagickImageCollection.prototype);
  const collectionMethods = Object.keys(colDesc).filter(
    (k) => typeof colDesc[k].value === 'function' && !k.startsWith('_')
  ).sort();

  const collectionProperties = Object.keys(colDesc).filter(
    (k) => !!colDesc[k].get && !k.startsWith('_')
  ).sort();

  const formats = wasm.MagickFormat
    ? Object.keys(wasm.MagickFormat).filter((k) => isNaN(Number(k))).sort()
    : [];

  const enums = {};
  for (const [key, val] of Object.entries(wasm)) {
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const keys = Object.keys(val).filter((k) => isNaN(Number(k)));
      if (keys.length > 0) {
        enums[key] = keys.sort();
      }
    }
  }

  const result = {
    generatedAt: new Date().toISOString(),
    wasmPackage: '@imagemagick/magick-wasm',
    version: '0.0.44',
    counts: {
      methods: methods.length,
      properties: properties.length,
      collectionMethods: collectionMethods.length,
      formats: formats.length,
      enums: Object.keys(enums).length,
    },
    methods,
    properties,
    collectionMethods,
    collectionProperties,
    formats,
    enums,
  };

  const outPath = path.resolve(__dirname, '../src/ops/engine-capabilities.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log('Successfully wrote ' + outPath);
  return result;
}

if (require.main === module) {
  probeEngine();
}

module.exports = { probeEngine };

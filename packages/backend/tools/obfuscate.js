const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const directoriesToObfuscate = [
  path.join(__dirname, 'ipc'),
  path.join(__dirname, 'repositories'),
  path.join(__dirname, 'utils'),
  path.join(__dirname, 'db')
];

function obfuscateFile(filePath) {
  if (!filePath.endsWith('.js')) return;
  
  const code = fs.readFileSync(filePath, 'utf8');
  console.log(`🔒 Obfuscating: ${filePath}`);
  
  const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: ['base64', 'rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
  });

  fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
}

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else {
      obfuscateFile(fullPath);
    }
  }
}

console.log("🚀 Starting EndoScribe Code Obfuscation...");
directoriesToObfuscate.forEach(dir => processDirectory(dir));
console.log("✅ All backend source code successfully obfuscated!");

import fs from 'fs';
import path from 'path';
import { PluginOption } from 'vite';

type CopyFileOptions = {
  src: string;
  dest: string;
  rename: string;
};

function copyFile(options: CopyFileOptions) {
  const sourceFile = path.resolve(__dirname, options.src);
  const targetPath = path.resolve(__dirname, options.dest);

  if (!fs.existsSync(sourceFile)) {
    console.error(`Source file '${sourceFile}' does not exist.`);
    return;
  }

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
  }

  fs.copyFileSync(sourceFile, path.resolve(targetPath, options.rename));

  console.log('File copied from', sourceFile, 'to', targetPath + options.rename);
}

function copyFilePlugin(options: CopyFileOptions): PluginOption {
  return {
    name: 'copy-file-plugin',
    enforce: 'post',
    buildStart: () => copyFile(options),
    writeBundle: () => copyFile(options),
  };
}
export default copyFilePlugin;

import * as fs from 'fs';
import * as path from 'path';
import * as sh from 'shelljs';
import { Properties } from './properties';
import * as yaml from 'js-yaml';
const version = require('../../package.json').version;

const _ = require('lodash');
sh.config.silent = true;

export function writeFile(folder: string, filename: string, contents: string): void {
  if (!fs.existsSync(folder)) {
    sh.mkdir(folder);
  }
  return fs.writeFileSync(folder + '/' + filename, contents);
}

export function readFile(path: string): string {
  if (fs.existsSync(path)) {
    const array = fs
      .readFileSync(path)
      .toString()
      .split('\n');
    return array[0].replace('\r', '');
  } else {
    console.log('unable to locate ' + path);
  }
  return '';
}

export function readFullFile(path: string): string[] {
  if (fs.existsSync(path)) {
    const array = fs
      .readFileSync(path)
      .toString()
      .split('\n');
    return array;
  } else {
    console.log('unable to locate ' + path);
  }
  return [];
}

export function readWholeFile(path: string): string {
  if (fs.existsSync(path)) {
    const array = fs.readFileSync(path).toString();
    return array;
  } else {
    console.log('unable to locate ' + path);
  }
  return '';
}

export function readFileFromTree(path: string): string {
  for (let i = 0; i < 5; i++) {
    if (fs.existsSync(path)) {
      return readFile(path);
    } else {
      path = '../' + path;
    }
  }
  return '';
}

export function getImageFile(name: string): string {
  const validImageTypes = ['png', 'jpg', 'jpeg', 'gif'];
  for (let type of validImageTypes) {
    const image = name + '.' + type;
    if (fs.existsSync(image)) {
      return image;
    }
  }
  return '';
}

export function getParentFolder(): string {
  return path.basename(path.dirname(process.cwd()));
}

export function getDirectories(srcpath: string): string[] {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

export function verifyFolder(folder: string): void {
  if (!fs.existsSync(folder)) {
    sh.mkdir('-p', folder);
  }
}

export function copyFileToFolder(src: string, dest: string): void {
  if (fs.existsSync(src)) {
    sh.mkdir('-p', dest);
    sh.cp('-rf', src, dest);
  }
}

export function getCurrentDirectory(): string {
  return sh.pwd();
}

export function initEmptyPath(path: string): void {
  if (fs.existsSync(path)) {
    sh.rm('-rf', path);
  }
  sh.mkdir('-p', path);
}

export function initPath(path: string): void {
  sh.mkdir('-p', path);
}

export function copyFolder(src: string, dest: string): void {
  sh.mkdir('-p', dest);
  sh.cp('-rf', src, dest);
}

export function readYaml(path: string): Properties {
  let yamlData = null;
  try {
    yamlData = yaml.safeLoad(fs.readFileSync(path, 'utf8'));
  } catch (err) {
    console.log(`Tutors ${version} encountered an error reading properties.yaml:`)
    console.log('--------------------------------------------------------------')
    console.log(err.mark.buffer);
    console.log('--------------------------------------------------------------')
    console.log(err.message);
    console.log ('Review this file and try again....');
    sh.exit(1);
  }
  return yamlData;
}

export function getHeader(fileName: string): string {
  let header = '';
  let array = fs
    .readFileSync(fileName)
    .toString()
    .split('\n');
  if (array[0][0] === '#') {
    header = array[0].substring(1);
  } else {
    header = array[0];
  }
  return header;
}

export function withoutHeader(fileName: string): string {
  let content = fs.readFileSync(fileName).toString();
  const line1 = content.indexOf('\n');
  content = content.substring(line1 + 1, content.length);
  content = content.trim();
  const line2 = content.indexOf('\n');
  if (line2 > -1) {
    content = content.substring(0, line2);
  }
  return content;
}

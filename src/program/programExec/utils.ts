import * as path from 'path';
import { programExtensions } from '../programExtensions';
const BASE_DIRECTORY: string = 'uploadedPrograms';

function fetchFilePath({ userId, name }) {
  const rootPath = path.resolve(__dirname, '../../..');
  const directoryPath = path.join(rootPath, BASE_DIRECTORY, userId);
  const fileName: string = `${name}.${programExtensions.JS}`;
  return {
    filePath: path.join(directoryPath, fileName),
    directoryPath: directoryPath,
  };
}

export { fetchFilePath };

import { IProgramExec } from './IProgramExec';
import { ProgramDto } from '../dtos/program.dto';
import { programExtensions } from '../programExtensions';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const BASE_DIRECTORY: string = 'uploadedPrograms';

export class ProgramExecJs implements IProgramExec {
  processExecutable(programDto: ProgramDto): void {
    try {
      const decodedExecutable = Buffer.from(
        programDto.executable,
        'base64',
      ).toString('utf-8');
      const { filePath, directoryPath } = this.fetchFilePath(programDto);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      fs.writeFileSync(filePath, decodedExecutable);
    } catch (error) {
      throw new Error(error);
    }
  }

  async runExecutable(programDto: ProgramDto): Promise<string> {
    const { filePath } = this.fetchFilePath(programDto);
    try {
      const result = await this.executeCommand('node', [filePath]);
      return result;
    } catch (error) {
      throw error;
    }
  }

  formatErrorMessage(error: Error): any {
    const messages: string[] = error.message.split('\n');
    messages[0] = messages[0].substring(messages[0].lastIndexOf('/') + 1);
    return messages.slice(0, 2);
  }

  private async executeCommand(
    command: string,
    args: string[] = [],
  ): Promise<string> {
    const process = spawnSync(command, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });
    if (process.error) {
      throw new Error('a');
    }

    const stdout = process.stdout?.toString();
    const stderr = process.stderr?.toString();

    if (process.status === 0) {
      return stdout;
    } else {
      throw new Error(stderr);
    }
  }

  private fetchFilePath({ userId, name }) {
    const rootPath = path.resolve(__dirname, '../../..');
    const directoryPath = path.join(rootPath, BASE_DIRECTORY, userId);
    const fileName: string = `${name}.${programExtensions.JS}`;
    return {
      filePath: path.join(directoryPath, fileName),
      directoryPath: directoryPath,
    };
  }
}

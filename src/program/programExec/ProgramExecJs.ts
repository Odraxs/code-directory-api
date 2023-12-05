import { IProgramExec } from './IProgramExec';
import { ProgramDto } from '../dtos/program.dto';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import { fetchFilePath } from './utils';

export class ProgramExecJs implements IProgramExec {
  processExecutable(programDto: ProgramDto): void {
    try {
      const decodedExecutable = Buffer.from(
        programDto.executable,
        'base64',
      ).toString('utf-8');
      const { filePath, directoryPath } = fetchFilePath(programDto);
      if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath);
      }

      fs.writeFileSync(filePath, decodedExecutable);
    } catch (error) {
      throw new Error(error);
    }
  }

  async runExecutable(programDto: ProgramDto): Promise<string> {
    const { filePath } = fetchFilePath(programDto);
    try {
      const result = (await this.executeCommand('node', [filePath])).trim();
      return result;
    } catch (error) {
      fs.rmSync(filePath, { recursive: true, force: true });
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
      throw new Error();
    }

    const stdout = process.stdout?.toString();
    const stderr = process.stderr?.toString();

    if (process.status === 0) {
      return stdout;
    } else {
      throw new Error(stderr);
    }
  }
}

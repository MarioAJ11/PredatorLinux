// Declaración de tipos para sudo-prompt
declare module 'sudo-prompt' {
  export interface ExecOptions {
    name?: string;
    icns?: string;
    env?: { [key: string]: string };
  }

  export function exec(
    cmd: string,
    options?: ExecOptions,
    callback?: (error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => void
  ): void;
}

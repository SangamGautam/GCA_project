// declare module 'file-saver';

declare module 'file-saver' {
    export function saveAs(blob: Blob, filename: string, opts?: { autoBom?: boolean }): void;
  }
  
export interface IFileStorage {
  upload(fileName: string, buffer: Buffer): Promise<{ url: string }>;
  download(fileUrl: string): Promise<Buffer>;
}
export interface CreateUploadCommand {
    fileName: string;
    fileBuffer: Buffer;
    userId: string;
}
import { randomUUID } from "crypto";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { IFileStorage } from "@domain/repositories/IFileStorage";

export class S3FileStorage implements IFileStorage {
    constructor(
        private readonly s3Client: S3Client,
        private readonly s3BucketName: string,
        private readonly s3PublicEndpoint: string,
    ) {}

    async upload(fileName: string, buffer: Buffer): Promise<{ url: string }> {
        const key = `${randomUUID()}-${fileName}`;

        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.s3BucketName,
                Key: key,
                Body: buffer,
                ContentType: "text/csv",
            }),
        );

        return { url: `${this.s3PublicEndpoint}/${this.s3BucketName}/${key}` };
    }

    async download(fileUrl: string): Promise<Buffer> {
        const key = fileUrl.split(`/${this.s3BucketName}/`)[1];

        const response = await this.s3Client.send(
            new GetObjectCommand({ Bucket: this.s3BucketName, Key: key }),
        );

        const chunks: Buffer[] = [];
        for await (const chunk of response.Body as AsyncIterable<Buffer>) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    }
}

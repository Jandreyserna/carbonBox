import { createContainer, InjectionMode, asValue } from 'awilix';
import { S3Client } from '@aws-sdk/client-s3';
import { registerDocumentProcessingModule } from '@infrastructure/dependency-injection';
import { PrismaClient } from '@prisma/client';

export function buildContainer() {
    const container = createContainer({injectionMode: InjectionMode.CLASSIC});

    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        endpoint: process.env.AWS_ENDPOINT,
        forcePathStyle: true,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        },
    });

    container.register({
        // infrastructure
        prisma: asValue( new PrismaClient() ),
        s3Client: asValue(s3Client),
        s3BucketName: asValue(process.env.S3_BUCKET_NAME as string),
        s3PublicEndpoint: asValue(process.env.AWS_ENDPOINT as string),
    });

    // register document processing module
    registerDocumentProcessingModule(container);

    return container;
}
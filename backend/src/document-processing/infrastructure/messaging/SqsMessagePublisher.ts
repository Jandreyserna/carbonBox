import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { IMessagePublisher } from "@shared/infrastructure/messaging/IMessagePublisher";

interface ProcessFileMessage {
    uploadId: string;
}

export class SqsMessagePublisher implements IMessagePublisher<ProcessFileMessage> {
    constructor(
        private readonly sqsClient: SQSClient,
        private readonly queueUrl: string,
    ){}

    async publish(message: ProcessFileMessage): Promise<void> {
        await this.sqsClient.send(new SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(message),
        }));
    }
}
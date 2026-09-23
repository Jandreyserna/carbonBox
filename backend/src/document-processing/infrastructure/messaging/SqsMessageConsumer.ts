import { ProcessFileCommand } from "@application/commands/objects";
import { DeleteMessageCommand, ReceiveMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { IMessageConsumer } from "@shared/infrastructure/messaging";

export class SqsMessageConsumer implements IMessageConsumer<ProcessFileCommand> {
    constructor(
        private readonly sqsClient: SQSClient,
        private readonly queueUrl: string,
    ) {}

    public async receive(): Promise <{ receiptHandle: string, body: ProcessFileCommand;  } | null> {
        const command = new ReceiveMessageCommand({
            QueueUrl: this.queueUrl,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10
        });

        const response = await this.sqsClient.send(command);

        if (!response.Messages || response.Messages.length === 0) {
            return null;
        }

        const [sqsMessage] = response.Messages;

        if(!sqsMessage.Body || !sqsMessage.ReceiptHandle) {
            return null;
        }

        const message: ProcessFileCommand = JSON.parse(sqsMessage.Body);

        return { receiptHandle: sqsMessage.ReceiptHandle, body: message };
    }

    public async deleteMessage(receiptHandle: string): Promise<void> {
        const command = new DeleteMessageCommand({
            QueueUrl: this.queueUrl,
            ReceiptHandle: receiptHandle
        });

        await this.sqsClient.send(command);
    }
}
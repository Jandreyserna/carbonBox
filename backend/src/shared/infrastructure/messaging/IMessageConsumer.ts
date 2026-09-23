export interface IMessageConsumer<TMessage = unknown> {
    receive(): Promise<{receiptHandle: string; body: TMessage} | null>;
    deleteMessage(receiptHandle: string): Promise<void>;
}
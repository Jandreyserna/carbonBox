export interface IMessageConsumer<TMessage = unknown> {
    receive(maxMessages?: number): Promise<Array<{receipthandle: string; body: TMessage}>>;
    deleteMessage(receiptHandle: string): Promise<void>;
}
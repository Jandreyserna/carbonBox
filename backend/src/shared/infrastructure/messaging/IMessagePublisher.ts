export interface IMessagePublisher<TMessage = unknown> {
    publish(message: TMessage): Promise<void>;
}
import { buildContainer } from '../main/container';

const container = buildContainer();
const POLL_INTERVAL_MS = 3000;

async function pollLoop() {
    const messageConsumer = container.resolve('messageConsumer');
    const processFileCommandHandler = container.resolve('processFileCommandHandler');

    const messages = await messageConsumer.receive(1);

    for (const { receiptHandle, body } of messages) {
        const result = await processFileCommandHandler.execute({ uploadId: body.uploadId });

        if (result.isLeft()) {
            console.error(`Error procesando upload ${body.uploadId}: ${result.value.message}`);
            continue;
        }
        await messageConsumer.deleteMessage(receiptHandle);
    }
}

setInterval(pollLoop, POLL_INTERVAL_MS);
console.log(`Worker escuchando la cola cada ${POLL_INTERVAL_MS} ms...`);
import { buildContainer } from '../main/container';

const container = buildContainer();
const POLL_INTERVAL_MS = 3000;

async function pollLoop() {
    const messageConsumer = container.resolve('messageConsumer');
    const processFileCommandHandler = container.resolve('processFileCommandHandler');

    const message = await messageConsumer.receive();

    if (!message) {
        return;
    }

    const { receiptHandle, body } = message;

    const result = await processFileCommandHandler.execute({ uploadId: body.uploadId });

    if (result.isLeft()) {
        console.error(`Error procesando upload ${body.uploadId}: ${result.value.message}`);
        return;
    }

    await messageConsumer.deleteMessage(receiptHandle);
}

setInterval(pollLoop, POLL_INTERVAL_MS);
console.log(`Worker escuchando la cola cada ${POLL_INTERVAL_MS} ms...`);
import { consumer, producer } from "./repositories";
import { logger } from "./commons/utils/Logger";

async function main(): Promise<void> {
  await producer.connect();
  logger.info("Kafka producer conected");

  await consumer.start();
  logger.info("card-processor initied");

  const shutdown = async (signal: string) => {
    logger.info({ signal }, "shutting down");
    try {
      await consumer.stop();
      await producer.disconnect();
    } catch (err) {
      logger.error({ err }, "error during shutdown");
    }
    process.exit(0);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

main().catch((err) => {
  logger.fatal({ err }, "card-processor failed to start");
  process.exit(1);
});

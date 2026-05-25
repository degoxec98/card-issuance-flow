import { Kafka, Consumer, logLevel, EachMessagePayload } from "kafkajs";
import { CloudEvent } from "../../commons/utils/events/cloud-event";
import { CardRequestData } from "../../commons/utils/events/events";
import { ProcessCardService } from "../../services/ProcessCardService";
import { logger } from "../../commons/utils/Logger";

const INPUT_TOPIC = "io.card.requested.v1";

export interface CardRequestConsumerProps {
  brokers: string[];
  clientId: string;
  groupId: string;
  service: ProcessCardService;
  config: Record<string, unknown>;
}

export class CardRequestConsumer {
  private consumer: Consumer;

  constructor(private props: CardRequestConsumerProps) {
    const kafka = new Kafka({
      clientId: props.clientId,
      brokers: props.brokers,
      logLevel: logLevel.WARN,
    });
    this.consumer = kafka.consumer({ groupId: props.groupId });
  }

  async start(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: INPUT_TOPIC,
      fromBeginning: true,
    });
    logger.info({ topic: INPUT_TOPIC }, "consumer initiated");

    await this.consumer.run({
      autoCommit: false,
      eachMessage: async (payload) => this.handleMessage(payload),
    });
  }

  async stop(): Promise<void> {
    await this.consumer.disconnect();
  }

  private async handleMessage({
    topic,
    partition,
    message,
  }: EachMessagePayload): Promise<void> {
    let event: CloudEvent<CardRequestData>;
    event = JSON.parse(message.value!.toString());
    try {
      await this.props.service.execute(event.data, event.source);
    } catch (err) {
      logger.error(
        { err, source: event.source, requestId: event.data?.requestId },
        "unexpected error processing message",
      );
    }
    await this.commit(topic, partition, message.offset);
  }

  private async commit(topic: string, partition: number, offset: string) {
    await this.consumer.commitOffsets([
      { topic, partition, offset: (BigInt(offset) + 1n).toString() },
    ]);
  }
}

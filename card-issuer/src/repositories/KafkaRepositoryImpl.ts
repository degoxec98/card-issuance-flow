import { Producer } from "kafkajs";
import { EventRepository } from "./EventRepository";
import { logger } from "../commons/utils/Logger";
import { Card } from "../domains/Cards";
import { CardStatus } from "../commons/enums";
import { CardRequestData, CloudEvent } from "../commons/utils/events/events";
import { buildCloudEvent } from "../commons/utils/events/cloud-event";
import { randomUUID } from "crypto";

export interface KafkaRepositoryProps {
  producer: Producer;
  config: {},
}

export class KafkaRepositoryImpl implements EventRepository {
  constructor(private props: KafkaRepositoryProps) {}

  protected getTimestamp() {
    return Date.now();
  }

  protected getUUID() {
    return randomUUID();
  }

  public async publishCreateCardEvent(
    card: Card,
    requestId: string,
  ): Promise<void> {
    try {
      await this.connect();
      const eventData = this.createEventData(card, requestId);
      const event = buildCloudEvent<CardRequestData>({
        source: this.getUUID(),
        type: "io.card.requested.v1",
        data: eventData,
      });
      await this.publish(event, requestId);
      await this.disconnect();
    } catch (error) {
      logger.error(error, "Error publishing create card event");
      await this.disconnect();
      throw new Error("Failed to publish create card event");
    }
  }

  private async connect(): Promise<void> {
    await this.props.producer.connect();
    logger.info("Kafka producer connected");
  }

  private async disconnect(): Promise<void> {
    await this.props.producer.disconnect();
  }

  private async publish<T>(event: CloudEvent<T>, key: string): Promise<void> {
    await this.props.producer.send({
      topic: event.type,
      messages: [
        {
          key,
          value: JSON.stringify(event),
          headers: {
            "ce-id": String(event.id),
            "ce-source": event.source,
            "ce-type": event.type,
            "ce-specversion": event.specversion,
            "content-type": "application/cloudevents+json",
          },
        },
      ],
    });
  }

  private createEventData(card: Card, requestId: string) {
    return {
      requestId,
      documentType: card.customer.documentType,
      documentNumber: card.customer.documentNumber,
      fullName: card.customer.fullName,
      email: card.customer.email,
      age: card.customer.age,
      type: card.product.type,
      currency: card.product.currency,
      status: CardStatus.PENDING,
      forceError: card.forceError,
    } as CardRequestData;
  }
}
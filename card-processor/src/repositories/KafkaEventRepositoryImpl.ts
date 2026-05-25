import { Producer } from "kafkajs";
import { buildCloudEvent, CloudEvent } from "../commons/utils/events/cloud-event";
import { CardIssuedData, CardDlqData, CardRequestData } from "../commons/utils/events/events";
import { EventRepository } from "./EventRepository";
import { logger } from "../commons/utils/Logger";
import { Card } from "../domains/Card";
import { CardStatus } from "../commons/enums";

export interface KafkaEventRepositoryImplProps {
  producer: Producer;
  config: Record<string, unknown>;
}

export class KafkaEventRepositoryImpl implements EventRepository {
  constructor(private props: KafkaEventRepositoryImplProps) {}

  async publishCardIssuedEvent(
    data: CardRequestData,
    card: Card,
    source: string,
  ): Promise<void> {
    try {
      const issuedData = this.getIssueData(data, card);
      const event = buildCloudEvent({
        source,
        type: "io.cards.issued.v1",
        data: issuedData,
      });
      await this.props.producer.send({
        topic: event.type,
        messages: [
          {
            key: event.data.documentNumber,
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
      logger.info(
        { topic: event.type, requestId: event.data.requestId },
        "Card issued event published",
      );
    } catch (error) {
      logger.error(error, "Error publishing card issued event");
      throw error;
    }
  }

  async publishCardDlqEvent(
    data: CardRequestData,
    source: string,
    reason: string,
    attempts: number,
  ): Promise<void> {
    try {
      const dlqData = this.getDlqData(data, reason, attempts);
      const event = buildCloudEvent({
        source,
        type: "io.card.requested.v1.dlq",
        data: dlqData,
      });
      await this.props.producer.send({
        topic: event.type,
        messages: [
          {
            key: event.data.documentNumber,
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
      logger.info(
        { topic: event.type, requestId: event.data.requestId },
        "Card DLQ event published",
      );
    } catch (error) {
      logger.error(error, "Error publishing card DLQ event");
      throw error;
    }
  }

  private getIssueData(data: CardRequestData, card: Card): CardIssuedData {
    return {
      requestId: data.requestId,
      documentNumber: data.documentNumber,
      card: {
        id: card.id,
        maskedNumber: card.maskedNumber,
        expiry: card.expiry,
        brand: card.brand,
        currency: data.currency,
      },
      status: CardStatus.EMITTED,
    };
  }

  private getDlqData(
    data: CardRequestData,
    reason: string,
    attempts: number,
  ): CardDlqData {
    return {
      requestId: data.requestId,
      documentNumber: data.documentNumber,
      reason,
      attempts: attempts,
      originalPayload: data,
      failedAt: new Date().toISOString(),
    };
  }
}

import { ProcessCardService } from "./ProcessCardService";
import { CardRequestData } from "../commons/utils/events/events";
import { Card } from "../domains/Card";
import { IssuanceError } from "../domains/errors";
import { DatabaseRepository } from "../repositories/DatabaseRepository";
import { EventRepository } from "../repositories/EventRepository";
import { retryWithBackoff } from "../commons/utils/retry";
import { logger } from "../commons/utils/Logger";

const RETRY_DELAYS_MS = [1000, 2000, 4000];

export interface ProcessCardServiceImplProps {
  databaseRepository: DatabaseRepository;
  eventRepository: EventRepository;
  config: Record<string, unknown>;
}

export class ProcessCardServiceImpl implements ProcessCardService {
  constructor(private props: ProcessCardServiceImplProps) {}

  private log = logger.child({ service: "ProcessCardServiceImpl" });

  async execute(data: CardRequestData, source: string): Promise<void> {
    let attempts = 0;
    try {
      await this.verifyIdempotency(data);
      const card = await this.generateCardWithRetries(data, source, attempts);
      await this.props.databaseRepository.save(data, card);
      await this.props.eventRepository.publishCardIssuedEvent(data, card, source);
      this.log.info(
        {
          cardId: card.id,
          maskedNumber: card.maskedNumber,
          attempts: attempts,
        },
        "card issued successfully",
      );
    } catch (error) {
      const reason = (error as Error).message;
      await this.props.eventRepository.publishCardDlqEvent(
        data,
        source,
        reason,
        attempts,
      );
      this.log.error(
        { attempts: attempts, reason },
        "exhausted retries, published in DLQ",
      );
    }
  }

  private async verifyIdempotency(
    data: CardRequestData,
  ): Promise<void> {
    const existing = await this.props.databaseRepository.findByDocument(
      data.documentNumber,
    );
    if (existing) {
      this.log.warn(
        { documentNumber: data.documentNumber },
        "duplicate event detected by document number, ignoring",
      );
      throw new Error("Duplicate event detected");
    }
  }

  private async generateCardWithRetries(
    data: CardRequestData,
    source: string,
    attempts: number,
  ): Promise<Card> {
    return retryWithBackoff(
      async (attempt) => {
        attempts = attempt + 1;
        this.log.info({ attempt: attempts }, "attempting to issue card");
        return this.simulateIssuance(data, attempt);
      },
      {
        delays: RETRY_DELAYS_MS,
        onRetry: (err, attemptNumber, delayMs) => {
          this.log.warn(
            {
              attempt: attemptNumber,
              nextDelayMs: delayMs,
              error: (err as Error).message,
            },
            "Failure to transmit, retrying...",
          );
        },
      },
    );
  }

  private async simulateIssuance(
    data: CardRequestData,
    attempt: number,
  ): Promise<Card> {
    const latency = 200 + Math.floor(Math.random() * 300);
    await new Promise((r) => setTimeout(r, latency));
    if (data.forceFailures && attempt < data.forceFailures) {
      throw new IssuanceError(
        `Forced failure by flag forceFailures (attempt ${attempt + 1}/${data.forceFailures})`,
      );
    }
    if (Math.random() < 0.5 || data.forceError) {
      throw new IssuanceError("External issuing service not available");
    }
    return Card.generate();
  }
}

import { randomUUID } from "crypto";
import { DatabaseRepository } from "./DatabaseRepository";
import { Card } from "../domains/Cards";
import { CardDto } from "../domains/dtos/CardDto";
import { CardStatus } from "../commons/enums";
import { IssueCardResponse } from "../domains/interfaces/IssueCardResponse";
import { logger } from "../commons/utils/Logger";

export interface DatabaseRepositoryProps {
  config: {};
}

export class InMemoryDatabaseRepositoryImpl implements DatabaseRepository {
  constructor(private props: DatabaseRepositoryProps) {}

  private byRequestId = new Map<string, CardDto>();
  private byDocument = new Map<string, CardDto>();

  protected getTimestamp() {
    return Date.now();
  }

  protected getUUID() {
    return randomUUID();
  }

  public async findCardByDocumentNumber(
    documentNumber: string,
  ): Promise<Card | undefined> {
    try {
      const result = this.byDocument.get(documentNumber);      
      return result ? this.unmarshalCard(result) : undefined;
    } catch (error) {
      logger.error(error, "Error querying card by document number");
      throw new Error("Failed to query card by document number");
    }
  }

  public async saveCard(card: Card): Promise<IssueCardResponse> {
    try {
      const item = this.marshalCard(card);
      this.byRequestId.set(item.id, item);
      this.byDocument.set(item.documentNumber, item);
      return {
        requestId: item.id,
        status: item.status,
      } as IssueCardResponse;
    } catch(error) {
      logger.error(error, "Error saving card");
      throw new Error("Failed to save card");
    }
  }

  private marshalCard(card: Card): CardDto {
    const timestamp = this.getTimestamp();
    return {
      id: this.getUUID(),
      documentType: card.customer.documentType,
      documentNumber: card.customer.documentNumber,
      fullName: card.customer.fullName,
      age: card.customer.age,
      email: card.customer.email,
      type: card.product.type,
      currency: card.product.currency,
      status: CardStatus.PENDING,
      creationDate: timestamp,
      updateDate: timestamp,
    }
  }

  private unmarshalCard(item: Record<string, any>): Card {
    return new Card({
      id: item.id,
      customer: {
        documentType: item.documentType,
        documentNumber: item.documentNumber,
        fullName: item.fullName,
        age: item.age,
        email: item.email,
      },
      product: {
        type: item.type,
        currency: item.currency,
      },
      status: item.status,
      creationDate: item.creationDate,
      updateDate: item.updateDate,
    });
  }
}
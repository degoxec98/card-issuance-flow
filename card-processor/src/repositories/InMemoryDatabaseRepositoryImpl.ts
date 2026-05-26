import { CardRequestData } from "../commons/utils/events/events";
import { Card } from "../domains/Card";
import { IssuedCardRecord } from "../domains/interfaces/IssuedCardRecord";
import { DatabaseRepository } from "./DatabaseRepository";

export interface InMemoryDatabaseRepositoryImplProps {
  config: Record<string, unknown>;
}

export class InMemoryDatabaseRepositoryImpl implements DatabaseRepository {
  private cards: Map<string, IssuedCardRecord> = new Map();
  private cardsByRequestId: Map<string, IssuedCardRecord> = new Map();

  constructor(private props: InMemoryDatabaseRepositoryImplProps) {}

  async save(data: CardRequestData, card: Card): Promise<void> {
    const record: IssuedCardRecord = {
      documentNumber: data.documentNumber,
      requestId: data.requestId,
      card,
      issuedAt: new Date().toISOString(),
    };
    this.cards.set(record.documentNumber, record);
    this.cardsByRequestId.set(record.requestId, record);
  }

  async findByDocument(
    documentNumber: string,
  ): Promise<IssuedCardRecord | undefined> {
    return this.cards.get(documentNumber);
  }
}

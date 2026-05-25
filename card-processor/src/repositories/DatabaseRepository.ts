import { CardRequestData } from "../commons/utils/events/events";
import { Card } from "../domains/Card";
import { IssuedCardRecord } from "../domains/interfaces/IssuedCardRecord";

export interface DatabaseRepository {
  save(data: CardRequestData, card: Card): Promise<void>;
  findByDocument(documentNumber: string): Promise<IssuedCardRecord | undefined>;
}

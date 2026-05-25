import { Card } from "../domains/Cards";
import { IssueCardResponse } from "../domains/interfaces/IssueCardResponse";

export interface DatabaseRepository {
  findCardByDocumentNumber(documentNumber: string): Promise<Card | undefined>;
  saveCard(card: Card): Promise<IssueCardResponse>;
}
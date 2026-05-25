import { IssuedCard } from "./IssuedCard";

export interface IssuedCardRecord {
  documentNumber: string;
  requestId: string;
  card: IssuedCard;
  issuedAt: string;
}
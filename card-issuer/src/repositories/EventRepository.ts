import { Card } from "../domains/Cards";

export interface EventRepository {
  publishCreateCardEvent(card: Card, requestId: string): Promise<void>;
}
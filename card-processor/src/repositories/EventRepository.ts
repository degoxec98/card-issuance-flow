import { CardRequestData } from "../commons/utils/events/events";
import { Card } from "../domains/Card";

export interface EventRepository {
  publishCardIssuedEvent(
		data: CardRequestData,
		card: Card,
		source: string,
	): Promise<void>;
  publishCardDlqEvent(
		data: CardRequestData,
		source: string,
		reason: string,
		attempts: number,
	): Promise<void>;
}
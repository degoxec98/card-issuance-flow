
import { Card } from "../domains/Cards";
import { CardsService } from "./CardsService";
import { IssueCardResponse } from "../domains/interfaces/IssueCardResponse";
import { DatabaseRepository } from "../repositories/DatabaseRepository";
import { logger } from "../commons/utils/Logger";
import { EventRepository } from "../repositories/EventRepository";

export interface CardsServiceProps {
  databaseRepo: DatabaseRepository;
  eventRepo: EventRepository;
  config: {},
}

export class CardsServiceImpl implements CardsService {
  constructor(private props: CardsServiceProps) {}

  public async issue(card: Card): Promise<IssueCardResponse> {
    try {
      await this.validateUniqueCustomerForCard(card.customer.documentNumber);
      // TODO: save customer
      const issue = await this.props.databaseRepo.saveCard(card);
      await this.props.eventRepo.publishCreateCardEvent(card, issue.requestId);
      return issue;
    } catch (error) {
      logger.error(error, "Error issuing card");
      throw new Error("Failed to issue card");
    }
  }

  private async validateUniqueCustomerForCard(
    documentNumber: string,
  ): Promise<void> {
    const existingCard = await this.props.databaseRepo.findCardByDocumentNumber(
      documentNumber
    );
    if (existingCard) {
      throw new Error("Customer with this document number already has a card");
    }
  }
}
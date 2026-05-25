import { Card } from "../domains/Cards";
import { IssueCardDto } from "../domains/dtos/IssueCardDto";
import { CardsService } from "../services/CardsService";


export interface CardsControllerProps {
  service: CardsService;
  config: {};
}

export class CardsController {
  constructor(protected props: CardsControllerProps) {}

  async issue(payload: IssueCardDto) {
    const card = Card.instanceForCreate({
      customer: {
        documentType: payload.customer.documentType,
        documentNumber: payload.customer.documentNumber,
        fullName: payload.customer.fullName,
        age: payload.customer.age,
        email: payload.customer.email,
      },
      product: {
        type: payload.product.type,
        currency: payload.product.currency,
      },
      forceError: payload.forceError,
    });

    return this.props.service.issue(card);
  }
}

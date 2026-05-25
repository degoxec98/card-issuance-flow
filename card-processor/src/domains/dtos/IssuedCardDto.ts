import { CardStatus } from "../../commons/enums";

export class IssuedCardDto {
  documentNumber!: string;
  requestId!: string;
  cardId!: string;
  maskedCardNumber!: string;
  expiry!: string;
  brand!: string;
  currency!: string;
  status!: CardStatus;
  issuedAt!: string;

  constructor(data: Partial<IssuedCardDto>) {
    Object.assign(this, data);
  }
}

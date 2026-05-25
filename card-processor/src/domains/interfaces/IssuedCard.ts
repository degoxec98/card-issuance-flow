import { CardBrand } from "../../commons/enums";

export interface IssuedCard {
  id: string;
  cardNumber: string;
  cvv: string;
  maskedNumber: string;
  expiry: string;
  brand: CardBrand;
}
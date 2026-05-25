import { randomUUID } from "node:crypto";
import { CardBrand } from "../commons/enums";

export class Card {
  id!: string;
  cardNumber!: string;
  cvv!: string;
  maskedNumber!: string;
  expiry!: string;
  brand!: CardBrand;

  constructor(data?: Partial<Card>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  static generate(): Card {
    const cardNumber = this.generateCardNumber();
    return new Card({
      id: randomUUID(),
      cardNumber,
      cvv: this.generateCvv(),
      maskedNumber: this.maskCardNumber(cardNumber),
      expiry: this.generateExpiry(),
      brand: CardBrand.VISA,
    });
  }

  private static generateCvv(): string {
    return Math.floor(Math.random() * 1e3).toString().padStart(3, "0");
  }
  
  private static generateCardNumber(): string {
    return "411111" + Math.floor(Math.random() * 1e9).toString().padStart(10, "0");
  }
  
  private static generateExpiry(): string {
    const now = new Date();
    const expires = new Date(now.getFullYear() + 4, now.getMonth());
    const mm = String(expires.getMonth() + 1).padStart(2, "0");
    const yy = String(expires.getFullYear()).slice(-2);
    return `${mm}/${yy}`;
  }
  
  static maskCardNumber(full: string): string {
    return full.slice(0, 4) + "*".repeat(full.length - 8) + full.slice(-4);
  }
}

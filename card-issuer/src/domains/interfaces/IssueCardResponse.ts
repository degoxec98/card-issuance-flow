import { CardStatus } from "../../commons/enums";

export interface IssueCardResponse {
  requestId: string;
  status: CardStatus;
}
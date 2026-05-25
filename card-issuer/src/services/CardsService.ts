import { Card } from "../domains/Cards";
import { IssueCardResponse } from "../domains/interfaces/IssueCardResponse";

export interface CardsService {
  issue(request: Card): Promise<IssueCardResponse>;
}
import { CardRequestData } from "../commons/utils/events/events";

export interface ProcessCardService {
  execute(data: CardRequestData, source: string): Promise<void>;
}

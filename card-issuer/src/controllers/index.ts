import { service } from "../services";
import { CardsController } from "./CardsController";

export const controller = new CardsController({
  service,
  config: {},
});

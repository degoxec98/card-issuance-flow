import { CardsServiceImpl } from "./CardsServiceImpl";
import { databaseRepo, eventRepo } from "../repositories";

export const service = new CardsServiceImpl({
  databaseRepo,
  eventRepo,
  config: {},
});
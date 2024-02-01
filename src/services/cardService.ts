import { GenericException } from "../exceptions/genericException";
import { CardDataResponse } from "../models/cardDataResponse";
import { RedisClient } from "../util/redisUtil";

export class CardService {
  private redisClient:RedisClient = new RedisClient();

  async getCardData(token:string): Promise<CardDataResponse>{
    const cardData = await this.redisClient.getValue(token);
    if (Object.keys(cardData).length === 0){
      throw new GenericException('Redis key not found', 404);
    }
    return cardData;
  }
}

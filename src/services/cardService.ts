import { GenericException } from "../exceptions/genericException";
import { CardDataResponse } from "../models/responses/cardDataResponse";
import RedisClient from "../util/redisUtil";
import { decryptData } from "../util/cryptoUtil";

export class CardService {
  constructor(private redisClient:RedisClient){}

  async getCardData(token:string): Promise<CardDataResponse>{
    const cardData = await this.redisClient.getValue(token);
    if (Object.keys(cardData).length === 0){
      throw new GenericException('Redis key not found', 404);
    }

    const cardDataDecrypted = decryptData(cardData);

    const cardDataResponse:CardDataResponse = JSON.parse(cardDataDecrypted);

    return cardDataResponse;
  }
}

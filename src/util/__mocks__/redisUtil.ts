import { CardDataResponse } from "../../models/responses/cardDataResponse";

export default class RedisClient{
  constructor(){
  }

  async setValue(key:string, value:any, expires:number){
  }

  async getValue(key:string): Promise<any>{
    const redisResponse:CardDataResponse = {
      card_number: 123123123,
      email: 'mock-email@gmail.com',
      expiration_month: '10',
      expiration_year: '2020'
    }
    return redisResponse;
  }
}


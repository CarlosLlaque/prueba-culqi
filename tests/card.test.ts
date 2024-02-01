import RedisClient from '../src/util/redisUtil';
import { CardService } from '../src/services/cardService';

jest.mock('../src/util/redisUtil')
jest.mock('../src/util/jwtUtil')

const redisClientMock = new RedisClient();
const cardService = new CardService(redisClientMock);

describe('retrieve card data',()=>{
  test('succesfull', async()=>{
    const cardDataResponse = await cardService.getCardData('abc');
    expect(cardDataResponse).toEqual({
      card_number: 123123123,
      email: 'mock-email@gmail.com',
      expiration_month: '10',
      expiration_year: '2020'
    })
  })

  test('key not found', async ()=>{
    jest.spyOn(redisClientMock, 'getValue').mockImplementation(async(key:string)=>{
      return {}
    })
    expect(async()=>await cardService.getCardData('abc')).rejects.toThrow('Redis key not found');
  })
})

import { GenerateTokenRequest } from '../src/models/requests/generateTokenRequest';
import { TokenService } from '../src/services/tokenService'
import { JwtUtil } from '../src/util/jwtUtil';
import RedisClient from '../src/util/redisUtil';

jest.mock('../src/util/redisUtil')
jest.mock('../src/util/jwtUtil')

const redisClientMock = new RedisClient();
const spyGenerateToken = jest.spyOn(JwtUtil, 'generateToken');
const spySaveRedis = jest.spyOn(redisClientMock, 'setValue');

beforeEach(()=>{
  spyGenerateToken.mockClear();
  spySaveRedis.mockClear();
})

describe('generate token', ()=>{
  test('succesfully generated',async()=>{
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@gmail.com',
      card_number: 100,
      cvv: 200,
      expiration_month: '10',
      expiration_year: '2022'
    };
    const generatedToken = await tokenService.generateToken(tokenReq);
    expect(generatedToken).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/);
    expect(spyGenerateToken).toHaveBeenCalledTimes(1);
    expect(spySaveRedis).toHaveBeenCalledTimes(1);
  })

  test('redis connection refused',async()=>{
    jest.spyOn(redisClientMock, 'setValue').mockImplementation(async(key:string, value:any, expires:number)=>{
      return Promise.reject(new Error('refused'));
    });
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@invalid.com',
      card_number: 100,
      cvv: 200,
      expiration_month: '10',
      expiration_year: '2022'
    };
    expect(async()=>await tokenService.generateToken(tokenReq)).rejects.toThrow();
  })
});

describe('validate token generation request', ()=>{
  test('succesfully validated', ()=>{
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@gmail.com',
      card_number: 4280796821315302,
      cvv: 200,
      expiration_month: '10',
      expiration_year: '2025'
    };
    const isValid = tokenService.validateTokenRequest(tokenReq);
    expect(isValid).toBeTruthy();
  })

  test('not allowed email domain', ()=>{
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@outlook.com',
      card_number: 4280796821315302,
      cvv: 200,
      expiration_month: '10',
      expiration_year: '2024'
    };
    expect(()=>tokenService.validateTokenRequest(tokenReq)).toThrow('Not a valid email domain');
  })

  test('expired card year', ()=>{
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@gmail.com',
      card_number: 4280796821315302,
      cvv: 200,
      expiration_month: '01',
      expiration_year: '2018'
    };
    expect(()=>tokenService.validateTokenRequest(tokenReq)).toThrow('The card has expired');
  })

  test('more than 5 years', ()=>{
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@gmail.com',
      card_number: 4280796821315302,
      cvv: 200,
      expiration_month: '01',
      expiration_year: '2050'
    };
    expect(()=>tokenService.validateTokenRequest(tokenReq)).toThrow('More than 5 years');
  })

  test('not a valid card number length', ()=>{
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@gmail.com',
      card_number: 123,
      cvv: 200,
      expiration_month: '10',
      expiration_year: '2024'
    };
    expect(()=>tokenService.validateTokenRequest(tokenReq)).toThrow('Not a valid card number: length');
  })

  test('not a valid card number: LUHN', ()=>{
    const tokenService = new TokenService(redisClientMock);
    const tokenReq:GenerateTokenRequest= {
      email: 'abc@gmail.com',
      card_number: 1111111111111111,
      cvv: 200,
      expiration_month: '10',
      expiration_year: '2024'
    };
    expect(()=>tokenService.validateTokenRequest(tokenReq)).toThrow('Not a valid card number');
  })
});

import * as redis from 'redis';
import { GenericException } from '../exceptions/genericException';

export default class RedisClient{
  private client: redis.RedisClientType;
  constructor(){
    this.client = redis.createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    });

    this.client.on('connect', () => {
      console.log('OK Redis connection');
    });

    this.client.on('error', (err) => {
      console.error('Error Redis connection:', err);
    });
  }

  async setValue(key:string, value:any, expires:number){
    try{
      this.client.connect();
      await this.client.hSet(key, value);
      await this.client.expire(key, expires);
    }catch (error){
      throw new Error('Error while setting value');
    }
    finally{
      this.client.quit();
    }
  }

  async getValue(key:string): Promise<any>{
    try{
      this.client.connect();
      return await this.client.hGetAll(key);
    }catch{
      throw new Error('Error while getting value');
    }
    finally{
      this.client.quit();
    }
  }
}

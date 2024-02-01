import * as redis from 'redis';

export class RedisClient{
  private client: redis.RedisClientType;
  constructor(){
    this.client = redis.createClient({
      url: 'redis://localhost:6379',
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
    }finally{
      this.client.quit();
    }
  }

  async getValue(key:string): Promise<any>{
    try{
      this.client.connect();
      return await this.client.hGetAll(key);
    }finally{
      this.client.quit();
    }
  }
}

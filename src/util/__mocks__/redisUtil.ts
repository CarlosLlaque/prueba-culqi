import { CardDataResponse } from "../../models/responses/cardDataResponse";

export default class RedisClient{
  constructor(){
  }

  async setValue(key:string, value:any, expires:number){
  }

  async getValue(key:string): Promise<any>{
    return 'ruuH4UWc4WD7NuAQdk1Tul1wBidFo+f4KdJpHQ/enxcxKzbKJmMhb5cLH5al9Ydl8zAe3krahdA88P5FPQo6JPKWmVi8SbVnKlxn31TKsacYqiIiL4D7RYTEQoV\
    A70uFsP79W8l5GyELMSKYhS+L73xtb+FVwT2oe25dGNDd0sn9qEjQ4sWVzxuoUD4XSwICG26u5lnZjrkXyKtDUFU0G7WmAoiZR6QYetIrUclmjBdea0Y8OTsoVa\
    Un9+nr4xta+CnSkLlvp69UArUmD1SgSok9FcDUzJifX69JtantDfPv/OWMVSWyOWwa6jS90N5a/KjDHPwvoYuY6nl4y5pD/A=='
  }
}


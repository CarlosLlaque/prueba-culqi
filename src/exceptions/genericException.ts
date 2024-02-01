export class GenericException extends Error{
  statusCode:number;

  constructor(message: string, statusCode: number){
    super(message);
    this.name = 'GenericException';
    this.statusCode = statusCode;
  }
}

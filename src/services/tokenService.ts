import { CardValidationException } from "../exceptions/cardValidationException";
import { GenerateTokenRequest } from "../models/requests/generateTokenRequest";
import { JwtUtil } from "../util/jwtUtil";
import RedisClient from "../util/redisUtil";

export class TokenService {

  constructor(private redisUtil: RedisClient){}


  async generateToken(tokenRequest: GenerateTokenRequest): Promise<string> {
    const jwtReq = {
      email: tokenRequest.email
    }

    const token = JwtUtil.generateToken(jwtReq);

    const redisPayload = {
      email: tokenRequest.email,
      cardNumber: tokenRequest.card_number,
      expirationYear: tokenRequest.expiration_year,
      expirationMonth: tokenRequest.expiration_month
    }

    await this.redisUtil.setValue(token, redisPayload, 60);
    
    return token;
  }

  validateTokenRequest(tokenRequest:GenerateTokenRequest): boolean{
    this.validateCardNumber(tokenRequest.card_number);
    this.validateCvv(tokenRequest.card_number, tokenRequest.cvv);
    this.validateExpiration(tokenRequest.expiration_month, tokenRequest.expiration_year);
    this.validateEmail(tokenRequest.email);

    return true
  }

  private validateCardNumber(cardNumber: number){
    const cardNumberStr = cardNumber.toString();

    if (cardNumberStr.length<13 || cardNumberStr.length>18){
      throw new CardValidationException('Not a valid card number: length', 400);
    }

    const reversedCardNumber = cardNumberStr.split('').reverse().join('');
    const digits = reversedCardNumber.split('').map(Number);

    const sum = digits.reduce((acc, digit, index) => {
      if (index % 2 === 1) {
        const doubledDigit = digit * 2;
        return acc + (doubledDigit > 9 ? doubledDigit - 9 : doubledDigit);
      }
      return acc + digit;
    }, 0);

    // La tarjeta es válida si la suma es un múltiplo de 10
    if(!(sum % 10 === 0)){
        throw new CardValidationException('Not a valid card number',400);
    }
  }

  private validateCvv(cardNumber:number, cvv: number){
    const cardIssuer = this.identifyCardIssuer(cardNumber);

    if ((cardIssuer == 'VISA' || cardIssuer == 'MasterCard') && cvv.toString().length !== 3){
      throw new CardValidationException('Not a valid CVV for VISA or MC', 400);
    }

    if (cardIssuer == 'Amex' && cvv.toString().length !== 4){
      throw new CardValidationException('Not a valid CVV for Amex', 400);
    }
  }

  private identifyCardIssuer(cardNumber:number):string{
    const primerosDigitos = parseInt(cardNumber.toString().slice(0, 2), 10);

    if (primerosDigitos >= 40 && primerosDigitos <= 49) {
      return "VISA";
    } else if (primerosDigitos >= 51 && primerosDigitos <= 55) {
      return "MasterCard";
    } else if (primerosDigitos === 34 || primerosDigitos === 37) {
      return "Amex";
    } else {
      throw new CardValidationException('Card Issuer not supported yet', 400);
    }
  }

  private validateExpiration(expirationMonth: string, expirationYear: string) {
    const expirationMonthNumber = parseInt(expirationMonth);
    const expirationYearNumber = parseInt(expirationYear);

    if (expirationMonthNumber < 1 || expirationMonthNumber > 12){
      throw new CardValidationException('Not a valid month, values must be between 1 and 12', 400);
    }
    if (expirationYear.length > 4) throw new CardValidationException('Not a valid year', 400);

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    // const fiveYearsAgo = currentYear - 5;

    if (expirationYearNumber - currentYear > 5) throw new CardValidationException('Not a valid year: More than 5 years', 400)


    if (expirationYearNumber < currentYear || 
            (expirationYearNumber === currentYear && expirationMonthNumber < currentMonth)) {
      throw new CardValidationException('The card has expired', 400);
    }

  }

  private validateEmail(email: string) {
    if (email.length <5 && email.length>100){
      throw new CardValidationException('Not a valid email length', 400);
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      throw new CardValidationException('Not a valid email', 400);
    }

    const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.es'];
    const emailDomain = email.split('@')[1];

    if (!allowedDomains.includes(emailDomain)) {
      throw new CardValidationException('Not a valid email domain', 400);
    }
  }
}

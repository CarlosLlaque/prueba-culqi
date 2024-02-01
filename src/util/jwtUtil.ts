import jwt, { VerifyErrors } from 'jsonwebtoken';
import { JwtException } from '../exceptions/jwtException';

const secretKey = 'culqi';
const expirationTime = '5m';

export class JwtUtil {

  static generateToken(payload:any): string {
    const token = jwt.sign(payload, secretKey, { expiresIn: expirationTime });
    return token;
  }

  static verifyToken(token:string) {
    jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: any) => {
      if (err) {
        throw new JwtException(err.message)
      }
    });
  }
}

import { IncomingMessage } from 'http';
import { IUser } from '../interfaces/interfaces';

export const getReqData = (req: IncomingMessage): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    try {
      let body: string = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        resolve(JSON.parse(body));
      });
    } catch (error) {
      reject(error);
    }
  });
};
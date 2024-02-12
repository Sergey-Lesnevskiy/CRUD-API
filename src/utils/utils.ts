import { IncomingMessage, ServerResponse } from 'http';
import { IUser } from '../interfaces/interfaces';
import { version, validate } from 'uuid';

export const uuidValidate = (id: string): boolean => {
  return validate(id) && version(id) === 4;
};

export const getReqData = (req: IncomingMessage, res: ServerResponse): Promise<IUser> => {
  return new Promise((resolve, reject) => {
    try {
      let body: string = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Internal error' }));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
const checkArrayForStrings = (hobbies: any): boolean => {
  for (let i = 0; i < hobbies.length; i++) {
    if (typeof hobbies[i] != 'string') {
      return false;
    }
  }
  return true;
};

export const isUserHasProperties = (usersData: any) => {
  if (
    !Array.isArray(usersData.hobbies) ||
    typeof usersData.age !== 'number' ||
    typeof usersData.username !== 'string'
  ) {
    return false;
  }
  if (usersData.hobbies.length === 0) return true;
  const arrayValidation = checkArrayForStrings(usersData.hobbies);
  if (!arrayValidation) return false;
  return true;
};

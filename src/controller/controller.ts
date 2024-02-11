import { users } from '../data/data';
import { IUser } from '../interfaces/interfaces';
import { v4 as uuidv4 } from 'uuid';

export class Controller {
  async getUsers(): Promise<IUser[]> {
    return new Promise((resolve) => resolve(users));
  }
  async getUserById(id: string): Promise<IUser | undefined> {
    return new Promise((resolve) => {
      const user = users.find((user) => user.id === id);
      resolve(user);
    });
  }
  async addUser(newUserToAdd: IUser): Promise<IUser> {
    return new Promise((resolve) => {
      const newUser = {
        id: uuidv4(),
        ...newUserToAdd,
      };
      users.push(newUser);
      resolve(newUser);
    });
  }
  async updateUserById(user: IUser): Promise<IUser | undefined> {
    return new Promise((resolve) => {
      const userIndex = users.findIndex((userInDatabase) => user.id === userInDatabase.id);
      if (userIndex === -1) {
        resolve(undefined);
      } else {
        users[userIndex] = user;
        resolve(users[userIndex]);
      }
    });
  }
  async deleteUserById(id: string): Promise<IUser | string> {
    return new Promise((resolve) => {
      const userIndex = users.findIndex((userInDatabase) => id === userInDatabase.id);
      if (userIndex === -1) {
        resolve(`No user with id ${id} found`);
      } else {
        users.splice(userIndex, 1);
        resolve('User deleted successfully');
      }
    });
  }
}
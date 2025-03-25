import { UserRepository } from '../repositories/UserRepository';
import { User, CreateUserDTO } from '../types/User';
 
 
export class UserService {
  private userRepository: UserRepository;
 
  constructor() {
    this.userRepository = new UserRepository();
  }
 
  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
 
  async createUser(userData: CreateUserDTO): Promise<User> {
    // Check if username or email already exists
    const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
    if (existingUserByUsername) {
      throw new Error('Username already taken');
    }
   
    const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
    if (existingUserByEmail) {
      throw new Error('Email already registered');
    }
   
    return this.userRepository.create(userData);
  }
}
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserService, User } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const users = service.findAll();
      expect(users).toBeInstanceOf(Array);
      expect(users.length).toBeGreaterThan(0);
    });

    it('should return users with correct structure', () => {
      const users = service.findAll();
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('email');
    });
  });

  describe('findById', () => {
    it('should return a user when found', () => {
      const user = service.findById(1);
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.name).toBe('John Doe');
    });

    it('should throw NotFoundException when user not found', () => {
      expect(() => service.findById(999)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException with correct message', () => {
      expect(() => service.findById(999)).toThrow('User with id 999 not found');
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const newUser = service.create({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
      expect(newUser).toBeDefined();
      expect(newUser.name).toBe('Jane Doe');
      expect(newUser.email).toBe('jane@example.com');
      expect(newUser).toHaveProperty('id');
    });

    it('should assign a unique id to the new user', () => {
      const user1 = service.create({
        name: 'User 1',
        email: 'user1@example.com',
      });
      const user2 = service.create({
        name: 'User 2',
        email: 'user2@example.com',
      });
      expect(user2.id).toBe(user1.id + 1);
    });

    it('should add the new user to the users array', () => {
      const initialCount = service.findAll().length;
      service.create({ name: 'New User', email: 'new@example.com' });
      expect(service.findAll().length).toBe(initialCount + 1);
    });
  });

  describe('update', () => {
    it('should update user properties', () => {
      const updatedUser = service.update(1, { name: 'Updated Name' });
      expect(updatedUser.name).toBe('Updated Name');
      expect(updatedUser.email).toBe('john.doe@example.com');
    });

    it('should throw NotFoundException when updating non-existent user', () => {
      expect(() => service.update(999, { name: 'Test' })).toThrow(
        NotFoundException,
      );
    });

    it('should return updated user with correct id', () => {
      const updatedUser = service.update(1, { email: 'newemail@example.com' });
      expect(updatedUser.id).toBe(1);
      expect(updatedUser.email).toBe('newemail@example.com');
    });
  });

  describe('remove', () => {
    it('should remove an existing user', () => {
      const initialCount = service.findAll().length;
      const result = service.remove(1);
      expect(result).toBe(true);
      expect(service.findAll().length).toBe(initialCount - 1);
    });

    it('should return false when removing non-existent user', () => {
      const result = service.remove(999);
      expect(result).toBe(false);
    });
  });
});

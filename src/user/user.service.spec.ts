import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from './schemas/user.schema';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockUserModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return users from mongodb', async () => {
      const users = [{ _id: '665f0a1234567890abcdef12', username: 'john' }];
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(users),
      });

      await expect(service.findAll()).resolves.toEqual(users);
      expect(mockUserModel.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a user when the ObjectId exists', async () => {
      const id = '665f0a1234567890abcdef12';
      const user = { _id: id, username: 'john' };
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(user),
      });

      await expect(service.findById(id)).resolves.toEqual(user);
      expect(mockUserModel.findById).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException when id is not a valid ObjectId', async () => {
      await expect(service.findById('abc')).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUserModel.findById).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when no user matches the ObjectId', async () => {
      const id = '665f0a1234567890abcdef12';
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
      expect(mockUserModel.findById).toHaveBeenCalledWith(id);
    });
  });
});

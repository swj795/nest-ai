import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', () => {
      const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
      ];
      mockUserService.findAll.mockReturnValue(users);

      const result = controller.findAll();

      expect(result).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a user by id', () => {
      const user = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockUserService.findById.mockReturnValue(user);

      const result = controller.findById(1);

      expect(result).toEqual(user);
      expect(mockUserService.findById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user not found', () => {
      mockUserService.findById.mockImplementation(() => {
        throw new NotFoundException('User with id 999 not found');
      });

      expect(() => controller.findById(999)).toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createDto = { name: 'New User', email: 'new@example.com' };
      const newUser = { id: 1, name: 'New User', email: 'new@example.com' };
      mockUserService.create.mockReturnValue(newUser);

      const result = controller.create(createDto);

      expect(result).toEqual(newUser);
      expect(mockUserService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a user', () => {
      const updateDto = { name: 'Updated Name', eamil: 'updated@example.com' };
      const updatedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com',
      };
      mockUserService.update.mockReturnValue(updatedUser);

      const result = controller.update(1, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', () => {
      mockUserService.remove.mockReturnValue(true);

      expect(() => controller.remove(1)).not.toThrow();
      expect(mockUserService.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when user not found', () => {
      mockUserService.remove.mockReturnValue(false);

      expect(() => controller.remove(999)).toThrow(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
        { _id: '665f0a1234567890abcdef12', username: 'john' },
        { _id: '665f0a1234567890abcdef13', username: 'jane' },
      ];
      mockUserService.findAll.mockReturnValue(users);

      const result = controller.findAll();

      expect(result).toEqual(users);
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', () => {
    it('should return a user by id', () => {
      const id = '665f0a1234567890abcdef12';
      const user = { _id: id, username: 'john' };
      mockUserService.findById.mockReturnValue(user);

      const result = controller.findById(id);

      expect(result).toEqual(user);
      expect(mockUserService.findById).toHaveBeenCalledWith(id);
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
      const id = '665f0a1234567890abcdef12';
      const updateDto = { name: 'Updated Name', eamil: 'updated@example.com' };
      const updatedUser = {
        _id: id,
        name: 'Updated Name',
        email: 'updated@example.com',
      };
      mockUserService.update.mockReturnValue(updatedUser);

      const result = controller.update(id, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(id, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', () => {
      const id = '665f0a1234567890abcdef12';
      const deletedUser = { _id: id, username: 'john' };
      mockUserService.delete.mockReturnValue(deletedUser);

      const result = controller.remove(id);

      expect(result).toEqual(deletedUser);
      expect(mockUserService.delete).toHaveBeenCalledWith(id);
    });
  });
});

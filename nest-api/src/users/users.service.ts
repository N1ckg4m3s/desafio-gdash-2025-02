import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';
import { UserRepository } from './user.repository';
import { randomBytes, scrypt as _scrypt, scryptSync } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UserRepository) { }

    async onModuleInit() {
        await this.createDefaultAdmin();
    }

    private async createDefaultAdmin() {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@admin.com';
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

        const existingAdmin = await this.userRepository.findByEmail(adminEmail);
        if (!existingAdmin) {
            const createUserDto: CreateUserDto = {
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
                name: 'admin'
            };
            const newUser = await this.create(createUserDto);
            if (newUser) {
                console.log('Default admin criado com sucesso');
            }
        }
    }

    async create(createUserDto: CreateUserDto) {
        const salt = randomBytes(16).toString('hex');
        const derivedKey = scryptSync(createUserDto.password, salt, 64);
        const hashedPassword = `${salt}:${derivedKey.toString('hex')}`;

        const userToSave = {
            ...createUserDto,
            password: hashedPassword,
        };

        const user = await this.userRepository.create(userToSave);

        if (!user) {
            throw new BadRequestException('Erro ao criar user');
        }

        // Retornar sem a senha
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async findAll(params: { page?: number; perPage?: number; query?: string } = {}) {
        const { page = 1, perPage = 10, query = '' } = params;

        const users = await this.userRepository.findAll({ page, perPage, query });

        const total = await this.userRepository.count({ query });

        if (!users) {
            throw new BadRequestException('Erro ao obter os usuarios')
        }
        return {
            users,
            total,
        };
    }

    async findById(id: string) {
        if (!id) {
            throw new BadRequestException('Id não informado')
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new BadRequestException('Erro ao obter usuario por id')
        }
        return { success: true, data: user };
    }

    async findByEmail(email: string) {
        if (!email) {
            throw new BadRequestException('Email não informado')
        }
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new BadRequestException('Erro ao obter usuario por email')
        }
        return { success: true, data: user };
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.update(id, updateUserDto);

        if (!user) {
            throw new BadRequestException('Erro ao atualizar usuario')
        }
        return { success: true, data: 'Usuario atualizado com sucesso' };
    }

    async remove(id: string) {
        const result = await this.userRepository.remove(id);

        if (!result) {
            throw new BadRequestException('Erro ao deletar usuario')
        }
        return { success: true, data: 'Usuario deletado com sucesso' };
    }
}

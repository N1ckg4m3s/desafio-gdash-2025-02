import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';
import { prisma } from 'src/db/dataBaseConnection';

@Injectable()
export class UserRepository {
    async create(createUserDto: CreateUserDto) {
        try {
            const user = await prisma.user.create({
                data: {
                    username: createUserDto.email,
                    password: createUserDto.password,
                    role: createUserDto.role || 'user',
                    name: createUserDto.name || 'without name'
                },
            });
            return user;
        } catch (error) {
            console.error(`Erro ao adicionar novo usuario: ${error}`)
            return undefined
        }
    }

    async findAll(params: { page?: number; perPage?: number; query?: string } = {}) {
        const { page = 1, perPage = 10, query = '' } = params;

        const skip = (page - 1) * perPage

        try {
            const users = await prisma.user.findMany({
                skip,
                take: perPage,
                where: {
                    OR: [
                        { username: { contains: query } },
                        { name: { contains: query } },
                    ],
                }
            });
            return users;
        } catch (error) {
            return undefined
        }
    }

    async findById(id: string) {
        try {
            const users = await prisma.user.findUnique({
                where: { id: id },
            });
            return users;
        } catch (error) {
            return undefined
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({
                where: { username: email },
            });
            return user;
        } catch (error) {
            return undefined
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            const user = await prisma.user.update({
                where: { id: id },
                data: {
                    username: updateUserDto.email,
                    name: updateUserDto.name,
                    role: updateUserDto.role,
                },
            });
            return user;
        } catch (error) {
            return undefined
        }
    }

    async remove(id: string) {
        try {
            await prisma.user.delete({
                where: { id: id },
            });
            return true;
        } catch (error) {
            return undefined
        }
    }

    async count(params: { query?: string }) {
        const { query } = params
        try {
            const users_total = await prisma.user.count({
                where: {
                    username: { contains: query },
                }
            });
            return users_total;
        } catch (error) {
            return undefined
        }
    }
}

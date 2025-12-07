import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, UseGuards, Query } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/http/decorators/roles.decorator';
import { AuthGuard } from 'src/guard/auth.guard';
import { RolesGuard } from 'src/guard/role.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @HttpCode(201)
    async create(@Body() createUserDto: CreateUserDto) {
        createUserDto.role = 'user'
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('admin')
    @Get("/get-all")
    async findAll(
        @Query('page') page?: string,
        @Query('perPage') perPage?: string,
        @Query('query') query?: string
    ) {
        const pageNum = page ? parseInt(page, 10) : 1;
        const perPageNum = perPage ? parseInt(perPage, 10) : 10;
        const searchQuery = query || '';

        return this.usersService.findAll({ page: pageNum, perPage: perPageNum, query: searchQuery });
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles('user', 'admin')
    @Delete(':id')
    @HttpCode(204)
    async remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}

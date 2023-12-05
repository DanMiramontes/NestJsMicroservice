import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { GetuserDto } from './dto/get-user-dto';

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository){}

    async create(createUserDto: CreateUserDto){
        await this.validateCreateUserDto(createUserDto);
        return this.usersRepository.create({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 10),
        });
    }

    private async validateCreateUserDto(createUserDto: CreateUserDto){
        try {
            await this.usersRepository.findOne({ email:createUserDto.email });
        } catch (err){
            return;
        }
        throw new UnprocessableEntityException('Email already exists.');
    }

    async verifyUser(email:string, password: string){
        const user = await this.usersRepository.findOne({ email });
        const passwordIsValid = await bcrypt.compare(password, user.password);
        if(!password) {
            throw new UnauthorizedException('Credentials are no valid.');
        }
        return user;
    }

    async getUser(getUserDto: GetuserDto) {
        return this.usersRepository.findOne(getUserDto);
    }
}

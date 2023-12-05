import { IsNotEmpty, IsString } from 'class-validator';

export class GetuserDto {
    @IsString()
    @IsNotEmpty()
    _id: string;
}
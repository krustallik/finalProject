import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class RegisterDto {
    @IsNotEmpty()
    @Length(2, 50)
    @IsString() name!: string;
    @IsNotEmpty()
    @IsEmail() email!: string;
    @IsNotEmpty()
    @Length(6, 100) password!: string;
}

export class LoginDto {
    @IsNotEmpty()
    @IsEmail() email!: string;
    @IsNotEmpty()
    @Length(6, 100) password!: string;
}

export class UpdateUserDto {
    @IsOptional()
    @Length(2, 50)
    @IsString() name?: string;
    @IsOptional()
    @IsEmail() email?: string;
}

export class UserResponseDto {
    id!: string;
    name!: string;
    email?: string;
}

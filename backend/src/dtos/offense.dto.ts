import { IsOptional, IsString, IsNumber, IsIn, IsNotEmpty, IsISO8601 } from 'class-validator';

const CATEGORIES = ['traffic','vandalism','theft','noise','parking','other'] as const;
export type Category = typeof CATEGORIES[number];

export class CreateOffenseDto {
    @IsNotEmpty() @IsString()
    description!: string;

    @IsOptional() @IsIn(CATEGORIES as unknown as string[])
    category?: Category;

    @IsOptional() @IsString()
    photoUrl?: string;
    @IsOptional() @IsString()
    photoId?: string;

    @IsOptional() @IsNumber()
    latitude?: number;
    @IsOptional() @IsNumber()
    longitude?: number;

    @IsISO8601()
    createdAt!: string;
}

export class UpdateOffenseDto {
    @IsOptional() @IsString()
    description?: string;

    @IsOptional() @IsIn(CATEGORIES as unknown as string[])
    category?: Category;

    @IsOptional() @IsString()
    photoUrl?: string;
    @IsOptional() @IsString()
    photoId?: string;

    @IsOptional() @IsNumber()
    latitude?: number;
    @IsOptional() @IsNumber()
    longitude?: number;
}

export class OffenseResponseDto {
    id!: string;
    userId!: string;
    description!: string;
    category?: Category;
    photoUrl?: string;
    photoId?: string;
    latitude?: number;
    longitude?: number;
    createdAt!: string;
}
import { Expose } from "class-transformer";
import { IsArray, IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";
import { UserRole } from "src/common/enums/all-enums";


export class UpdateProfileDto {

    @IsOptional()
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    name?: string


    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsUrl()
    linkedinUrl: string

    @IsOptional()
    @IsString()
    location?: string


    @IsOptional()
    @IsString()
    bio?: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    skills?: string[]

    @IsOptional()
    @IsString()
    companyName?: string


    @IsOptional()
    @IsString()
    companyDescription?: string

    @IsOptional()
    @IsUrl()
    companyUrl?: string

}

export class ProfileResponseDto {
    @Expose() id: string
    @Expose() name: string
    @Expose() email: string
    @Expose() role: UserRole
    @Expose() isVerified: boolean
    @Expose() isActive: boolean
    @Expose() avatar: string | null
    @Expose() resumeUrl: string | null
    @Expose() phone: string | null
    @Expose() location: string | null
    @Expose() bio: string | null
    @Expose() profileCompletion: number
    @Expose() createdAt: Date
}
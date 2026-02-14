import { Expose } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, Length } from "class-validator";


export class CreateCompanyDto {
    @IsNotEmpty()
    @Length(1,100)
    name: string

    @IsNotEmpty()
    @Length(1,30)
    slug: string


    @IsOptional()
    @Length(1,5000)
    description?: string

    @IsOptional()
    @IsUrl()
    website?: string

    @IsOptional()
    @Length(1,50)
    industry?: string

    @IsOptional()
    @Length(1,50)
    size?: string

    @IsOptional()
    @Length(1,50)
    location?: string

    @IsOptional()
    @IsNumber()
    foundedYear?: number

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    benefits?: string[]

    @IsOptional()
    @Length(1,5000)
    culture?: string

}
export class CompanyResponseDto {

    @Expose() id: string

    @Expose() name: string

    @Expose() slug: string

    @Expose() description: string

    @Expose() logoUrl?: string

    @Expose() logoPublicId?: string

    @Expose() website?: string

    @Expose() benefits?: string[]

    @Expose() isVerified: boolean

    @Expose() createdAt: Date;

}

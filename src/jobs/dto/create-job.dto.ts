import { IsArray, IsBoolean, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, MaxLength, Min, MinLength, IsDateString } from "class-validator";
import { JobType, JobLevel, JobStatus, WorkplaceType } from "../../common/enums/all-enums";
import { Expose, Transform, Type } from "class-transformer";



export class CreateJobDto {
    @IsNotEmpty()
    @MaxLength(100)
    title: string

    @IsNotEmpty()
    @IsString()
    description: string


    @IsOptional()
    @IsString()
    location?: string


    @IsNotEmpty()
    @IsEnum(JobType)
    jobType: JobType

    @IsNotEmpty()
    @IsEnum(JobLevel)
    jobLevel: JobLevel

    @IsOptional()
    @IsEnum(JobStatus)
    status?: JobStatus

    @IsOptional()
    @IsEnum(WorkplaceType)
    workplaceType?: WorkplaceType

    @IsOptional()
    @IsString()
    category?: string

    @IsOptional()
    @IsString()
    department?: string

    @IsOptional()
    @IsString()
    currency?: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    benefits?: string[]

    @IsOptional()
    @IsDateString()
    applicationDeadline?: string

    @IsOptional()
    @IsInt()
    @Min(1)
    numberOfPositions?: number

    @IsOptional()
    @IsString()
    slug?: string

    @IsOptional()
    @IsBoolean()
    featured?: boolean

    @IsOptional()
    @IsBoolean()
    relocationAssistance?: boolean

    @IsOptional()
    @IsInt()
    @Min(1)
    salaryMin?: number


    @IsOptional()
    @IsInt()
    salaryMax?: number



    @IsOptional()
    @IsString()
    experienceLevel?: string

    @IsOptional()
    @IsArray()
    @IsString({each: true})
    skillsRequired?: string[]

    @IsOptional()
    @IsBoolean()
    isActive?: boolean


    @IsOptional()
    @IsBoolean()
    isClosed?: boolean

}


export class EmployerDto {

    @Expose()
    email: string

    @Expose()
    name: string

    @Expose()
    avatar?: string

    @Expose()
    companyName?: string
}

export class JobResponseDto {
    @Expose()
    id: string

    @Expose()
    title: string

    @Expose()
    description: string

    @Expose()
    category: string

    @Expose()
    location: string

    @Expose()
    jobType: JobType

    @Expose()
    jobLevel: JobLevel

    @Expose()
    workplaceType: WorkplaceType

    @Expose()
    status: JobStatus

    @Expose()
    department: string

    @Expose()
    @Transform(({value}) => Number(value))
    salaryMin: number

    @Expose()
    @Transform(({value}) => Number(value))
    salaryMax: number

    @Expose()
    currency: string

    @Expose()
    benefits: string[]

    @Expose()
    experienceLevel: string

    @Expose()
    skillsRequired: string[]

    @Expose()
    numberOfPositions: number

    @Expose()
    slug: string

    @Expose()
    featured: boolean

    @Expose()
    applicationDeadline: Date

    @Expose()
    @Transform(({value}) => value === 'true' || value === true)
    isActive: boolean

    @Expose()
    @Transform(({value}) => value === 'true' || value === true)
    isClosed: boolean

    @Expose()
    viewCount: number

    @Expose()
    applicationCount: number

    @Expose()
    relocationAssistance: boolean

    @Expose()
    createdAt: Date

    @Expose()
    updatedAt: Date

    @Expose()
    @Type(() => EmployerDto)
    employer: EmployerDto
}
import { Expose,Type } from "class-transformer"
import { ReviewStatus,JobType,JobStatus,JobLevel } from "src/common/enums/all-enums";



class AdminCompanyDto {
  @Expose()
  name: string;

  @Expose()
  slug: string;

  @Expose()
  website: string;
}
class AdminJobDto {
    @Expose() id :string
    @Expose() title :string
    @Expose() slug :string
    @Expose() description :string
    @Expose() website:string
}
class AdminUserDto {
    @Expose()
    id: string

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    avatar: string;
}

export class AdminCompanyResponseDto {

    @Expose() id: string

    @Expose() name: string

    @Expose() slug: string

    @Expose() description: string

    @Expose()
    @Type(() =>  AdminUserDto)
    owner:  AdminUserDto

    @Expose()
    @Type(() =>  AdminJobDto)
    jobs:  AdminJobDto[]
    
    @Expose() industry: string

    @Expose() size: string
    
    @Expose() culture: string

    @Expose() location: string

    @Expose() logoUrl?: string


    @Expose() website?: string

    @Expose() benefits?: string[]

    @Expose() isVerified: boolean

    @Expose() isBanned: boolean

    @Expose() isActive: boolean

    @Expose() foundedYear: number
    
    @Expose() createdAt: Date

    @Expose() updatedAt: Date

}
export class AdminBanResponse extends AdminCompanyResponseDto {
  @Expose()
  banReason: string
}
export class AdminUserResponseDto  {
    @Expose() id :string
    @Expose() name :string
    @Expose() email :string
    @Expose() role:string
    @Expose() isVerified:string
    @Expose() isActive:string
}

export class AdminJobResponseDto {
  @Expose()
  id: string;

  @Expose()
  employerId: string;

  @Expose()
  companyId: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  category?: string;

  @Expose()
  location?: string;

  @Expose()
  jobType: JobType;

  @Expose()
  jobLevel: JobLevel;

  @Expose()
  workplaceType: JobType;

  @Expose()
  status: JobStatus;

  @Expose()
  reviewStatus: ReviewStatus
  
  @Expose()
  reviewReason: string

  @Expose()
  department?: string;

  @Expose()
  salaryMin?: number;

  @Expose()
  salaryMax?: number;

  @Expose()
  currency?: string;

  @Expose()
  benefits?: string[];

  @Expose()
  experienceLevel?: string;

  @Expose()
  skillsRequired?: string[];

  @Expose()
  numberOfPositions: number;

  @Expose()
  slug: string;

  @Expose()
  featured: boolean;

  @Expose()
  applicationDeadline?: Date;

  @Expose()
  isActive: boolean;

  @Expose()
  isClosed: boolean;

  @Expose()
  viewCount: number;

  @Expose()
  applicationCount: number;

  @Expose()
  relocationAssistance?: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => AdminUserDto)
  employer: AdminUserDto;

  @Expose()
  @Type(() => AdminCompanyDto)
  company: AdminCompanyDto;
}

export class AdminAppResponseDto {
  @Expose() id: string
  @Expose() jobId: string
  @Expose() status: string
  @Expose()
  @Type(() =>  AdminJobDto)
  job:  AdminJobDto
  @Expose()
  @Type(() => AdminUserDto)
  user: AdminUserDto
  @Expose() coverLetter: string
  @Expose() source: string
  @Expose() resumeUrl: string
  @Expose() expectedSalary: string
  @Expose() reviewedAt: Date
  @Expose() rejectionReason: string
  @Expose() employerNote: string
  @Expose() withdrawnAt: Date
  @Expose() deletedAt: Date
  @Expose() appliedAt: Date
  @Expose() createdAt: Date
}
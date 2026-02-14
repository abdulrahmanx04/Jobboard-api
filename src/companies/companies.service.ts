import { ConflictException, Injectable } from '@nestjs/common';
import { CompanyResponseDto, CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { UserData } from 'src/common/interfaces/all.interfaces';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { UploadApiResponse } from 'cloudinary';
import { plainToInstance } from 'class-transformer';
import { FilterOperator, paginate, PaginateConfig, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class CompaniesService {
  constructor(@InjectRepository(Company) private companyRepo: Repository<Company>, 
  private cloudinaryService: CloudinaryService
) {}

  async  create(dto: CreateCompanyDto, userData: UserData, file?: Express.Multer.File) {
      await this.companyExists(dto)
      let upload= await this.logoUrl(file)
      let company = await this.createCompany(dto,userData,upload)
      return plainToInstance(CompanyResponseDto,company, {excludeExtraneousValues: true})
  }

  async findAll(query: PaginateQuery) {
      const companies= await this.getCompanies(query)
      const data= plainToInstance(CompanyResponseDto,companies.data, {excludeExtraneousValues: true})
      return {
        ...companies,
        data
      }
  }

  async findOne(id: string) {
    const company= await this.companyRepo.findOneOrFail({where :{id, isVerified: true}})
    return plainToInstance(CompanyResponseDto,company, {excludeExtraneousValues: true})
  }

  async findBySlug(slug: string) {
    const company = await this.companyRepo.findOneOrFail({where: {slug}})
    return plainToInstance(CompanyResponseDto,company, {excludeExtraneousValues: true})
  }

  async findOwnedCompanies(query: PaginateQuery,userData: UserData) {
      const companies= await this.getOwnedCompanies(query,userData)
      const data= plainToInstance(CompanyResponseDto,companies.data, {excludeExtraneousValues: true})
      return {
          ...companies,
          data
      }
  }

  async  update(id: string, dto: UpdateCompanyDto, userData: UserData, file?: Express.Multer.File) {
      const company= await this.companyRepo.findOneOrFail({where: {id,ownerId: userData.id}})
      this.companyRepo.merge(company,dto)
      await this.handleUpdateLogo(company,file)
      await this.companyRepo.save(company)
      return plainToInstance(CompanyResponseDto,company, {excludeExtraneousValues: true})
  }

  async remove(id: string, userData: UserData) {
    const company= await this.companyRepo.findOneOrFail({where: {id,ownerId: userData.id}})
    if(company.logoUrl){
      await this.cloudinaryService.deleteFile(company.logoPublicId)
    }
    await this.companyRepo.delete({id,ownerId: userData.id})
  }

  private  async createCompany(dto: CreateCompanyDto,userData: UserData, upload: UploadApiResponse| null) {
     return await this.companyRepo.save(this.companyRepo.create({
        ...dto,
        ownerId: userData.id,
        logoUrl: upload?.secure_url,
        logoPublicId: upload?.public_id
      }))
  }

  private async companyExists(dto: CreateCompanyDto) {
      const exists= await this.companyRepo.findOne({where: [
        {slug: dto.slug,},
        {name: dto.name}]})
      if(exists) {
        throw new ConflictException("Company exists")
      }
  }

  private async logoUrl(file?: Express.Multer.File) {
     let upload: UploadApiResponse | null = null
      if(file) {
         upload= await this.cloudinaryService.uploadFile(file,'logo')
     }
     return upload
  }
  private async handleUpdateLogo(company: Company , file?: Express.Multer.File) {
       if(file){
        const upload = await this.logoUrl(file)
        if(upload?.secure_url) {
          company.logoUrl= upload.secure_url 
          company.logoPublicId= upload?.public_id}
      }
  }
  private async getCompanies(query: PaginateQuery) {
      return await paginate(query,this.companyRepo, {
         ...this.companyPaginateConfig,
          where: {isVerified: true}
      })
  }

  private async getOwnedCompanies(query: PaginateQuery,userData: UserData) {
     return await paginate(query,this.companyRepo, {
          ...this.companyPaginateConfig,
          where: {ownerId: userData.id}
      })
  }   

   private  companyPaginateConfig: PaginateConfig<Company> = {
      sortableColumns: ['createdAt','updatedAt','name','location','industry','size','isVerified','foundedYear'],
      searchableColumns: ['name', 'slug', 'description', 'industry', 'location'],
      filterableColumns: {
        name: [FilterOperator.ILIKE],
        slug: [FilterOperator.ILIKE],
        location: [FilterOperator.ILIKE],
        industry: [FilterOperator.ILIKE],
        size: [FilterOperator.EQ, FilterOperator.IN],
        isVerified: [FilterOperator.EQ],
        foundedYear: [FilterOperator.GTE, FilterOperator.LTE],
        createdAt: [FilterOperator.GTE, FilterOperator.LTE],
      },
      defaultSortBy: [['createdAt','DESC']],
      defaultLimit: 10,
      maxLimit: 100,
  }
}

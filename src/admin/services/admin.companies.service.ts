import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { FilterOperator, paginate, PaginateConfig, PaginateQuery } from "nestjs-paginate";
import { Company } from "src/companies/entities/company.entity";
import { Repository } from "typeorm";
import { BadRequestException, Injectable } from "@nestjs/common";
import { AdminBanResponse, AdminCompanyResponseDto } from "../dto/response.dto";
import { BanCompanyDto, VerifyCompanyDto } from "../dto/update-admin.dto";

@Injectable()
export class AdminCompaniesService {
    constructor(@InjectRepository(Company) private companyRepo: Repository<Company>){}

    async findAll(query: PaginateQuery): Promise<{data: AdminCompanyResponseDto[], meta: any}> {
        const companies= await paginate(query,this.companyRepo,this.companyConfig)
        const data= plainToInstance(AdminCompanyResponseDto,companies.data,{excludeExtraneousValues: true})
        return {
            ...companies,
            data
        }
    }

    async findOne(id: string): Promise<AdminCompanyResponseDto> {
        const company= await this.companyRepo.findOneOrFail({where: {id},relations: ['owner','jobs']})
        return plainToInstance(AdminCompanyResponseDto, company, {excludeExtraneousValues: true})
    }

    async verifyCompany(id: string,dto: VerifyCompanyDto) {
        const company= await this.companyRepo.findOneOrFail({where: {id},relations: ['owner','jobs']})
        company.isVerified= dto.isVerified
        company.isActive = dto.isVerified 
        const saved=  await this.companyRepo.save(company)
        return plainToInstance(AdminCompanyResponseDto, saved, {excludeExtraneousValues: true})
    }

    async banCompany(id: string, dto: BanCompanyDto) {
        const company= await this.companyRepo.findOneOrFail({where: {id},relations: ['owner','jobs']})
        company.isBanned= dto.isBanned
        this.updateAfterBan(dto,company)
        const saved=  await this.companyRepo.save(company)
        return plainToInstance(AdminBanResponse, saved, {excludeExtraneousValues: true})
    }

    async delete(id: string) {
        const company= await this.companyRepo.findOneOrFail({where: {id}})
        if(company.deletedAt) throw new BadRequestException('Company already deleted')
        company.deletedAt= new Date()
        await this.companyRepo.save(company)
    }

    private companyConfig: PaginateConfig<Company>= {
        sortableColumns: ['createdAt','updatedAt','isVerified','slug','foundedYear','isActive','isBanned'],
            searchableColumns: ['name','description','slug','industry','website','location','owner.name','jobs.title','jobs.description'],
            filterableColumns: {
                slug: [FilterOperator.ILIKE],
                name: [FilterOperator.ILIKE],
                description: [FilterOperator.ILIKE],
                isVerified: [FilterOperator.EQ],
                isBanned: [FilterOperator.EQ],
                isActive: [FilterOperator.EQ],
                foundedYear: [FilterOperator.GTE,FilterOperator.LTE],
                createdAt: [FilterOperator.GTE,FilterOperator.LTE],
                updatedAt: [FilterOperator.GTE,FilterOperator.LTE],
            },
            relations: ['owner','jobs'],
            defaultSortBy: [['createdAt','DESC']],
            defaultLimit: 10,
            maxLimit: 100 
    }

    private updateAfterBan(dto: BanCompanyDto,company: Company) {
        if (dto.isBanned) {
            if(!dto.banReason) throw new BadRequestException('Ban reason is required')
            company.isVerified = false
            company.isActive = false
            company.banReason = dto.banReason
        } else {
            company.banReason = null
        }
    }
}
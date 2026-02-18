import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import { FilterOperator, paginate, PaginateConfig, PaginateQuery } from "nestjs-paginate";
import { Application } from "src/applications/entities/application.entity";
import { Repository } from "typeorm";
import { AppStatus } from "../dto/update-admin.dto";
import { ApplicationStatus } from "src/common/enums/all-enums";
import { AdminAppResponseDto } from "../dto/response.dto";


@Injectable()
export class AdminAppService {
    constructor(@InjectRepository(Application) private appRepo: Repository<Application>){}


    async findAll(query: PaginateQuery): Promise<{meta: any, data: AdminAppResponseDto[]}> {
        const applications= await paginate(query,this.appRepo,this.appConfig)
        const data= plainToInstance(AdminAppResponseDto, applications.data, {excludeExtraneousValues: true})
        return {
            ...applications,
            data
        }
    } 

    async findOne(id: string): Promise<AdminAppResponseDto> {
        const application=  await this.appRepo.findOneOrFail({where: {id}, relations: ['job','job.company','job.employer','user']})
        return plainToInstance(AdminAppResponseDto, application, {excludeExtraneousValues: true})
    }
    async updateStatus(id: string, dto: AppStatus): Promise<AdminAppResponseDto> {
        const application=  await this.appRepo.findOneOrFail({where: {id},relations: ['job','job.company','job.employer','user']})
        this.checkAppStatus(application,dto)
        application.status= dto.status
        const saved=await this.appRepo.save(application)
        return plainToInstance(AdminAppResponseDto,saved, {excludeExtraneousValues: true})
    }

    async restoreApp(id: string): Promise<AdminAppResponseDto> {
        const application = await this.appRepo.findOneOrFail({
                where: { id },
                relations: ['job','job.company','job.employer','user'],
                withDeleted: true,
                
        })

        if (!application.deletedAt) {
            throw new BadRequestException('Application is not deleted');
        }

        application.deletedAt = null;
        const saved = await this.appRepo.save(application);
        return plainToInstance(AdminAppResponseDto, saved, { excludeExtraneousValues: true });
    }

    async deleteApp(id: string) {
        const application=  await this.appRepo.findOneOrFail({where: {id}})

        if (application.deletedAt) {
            throw new BadRequestException('Application is already deleted');
        }
        application.deletedAt= new Date()
        await this.appRepo.save(application)
    
    }


    private appConfig: PaginateConfig<Application>= {
           sortableColumns: ['appliedAt','status','reviewedAt','deletedAt','withdrawnAt'],
            searchableColumns: ['status','job.title','job.description','job.category'],
            filterableColumns: {
            status: [FilterOperator.IN],           
                jobId: [FilterOperator.EQ, FilterOperator.IN],
                'job.employerId': [FilterOperator.EQ, FilterOperator.IN],
                appliedAt: [FilterOperator.GTE, FilterOperator.LTE],
                reviewedAt: [FilterOperator.GTE, FilterOperator.LTE],
                withdrawnAt: [FilterOperator.EQ],
                deletedAt: [FilterOperator.EQ],
            },
            relations: ['job','job.employer','job.company','user'],
            defaultSortBy: [['appliedAt','DESC']],
            defaultLimit: 10,
            maxLimit: 100
    }

   private checkAppStatus(application: Application, dto: AppStatus) {
        if (application.deletedAt) throw new BadRequestException('Application is deleted');
        if (application.status === ApplicationStatus.WITHDRAWN) throw new BadRequestException('Application was withdrawn');

        const allowed =
            application.status === ApplicationStatus.PENDING
            ? [ApplicationStatus.REVIEWED, ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED]
            : application.status === ApplicationStatus.REVIEWED
                ? [ApplicationStatus.ACCEPTED, ApplicationStatus.REJECTED]
                : [];

        if (!allowed.includes(dto.status)) {
            throw new BadRequestException(`Invalid status transition: ${application.status} -> ${dto.status}`);
        }

        if (!application.reviewedAt && application.status === ApplicationStatus.PENDING) {
            application.reviewedAt = new Date();
        }
   }
}
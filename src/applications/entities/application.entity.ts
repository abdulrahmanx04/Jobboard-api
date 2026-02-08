import { User } from "../../auth/entities/auth.entity";
import { Job } from "../../jobs/entities/job.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { JoinColumn } from "typeorm";
export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('applications')
@Unique(['userId','jobId'])
@Index(['jobId'])
@Index(['userId'])
export class Application {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({type: 'enum',enum: ApplicationStatus,default: ApplicationStatus.PENDING})
    status: ApplicationStatus

    @Column()
    userId: string

    @ManyToOne(() => User, user => user.applications,{onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User

    
    @Column()
    jobId: string

    @ManyToOne(() => Job, job => job.applications, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'jobId' })
    job: Job

    @Column({ type: 'text', nullable: true })
    coverLetter: string;

    @Column({ nullable: true })
    resumeUrl: string;
  
    @CreateDateColumn()
    appliedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}

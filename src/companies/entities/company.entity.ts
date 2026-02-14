import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';
import { User } from '../../auth/entities/auth.entity';

@Entity('companies')
@Index(['isVerified'])
@Index(['ownerId'])
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  logoUrl: string 

  @Column({ nullable: true })
  logoPublicId: string 

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  size: string; 

  @Column({ nullable: true })
  location: string; 

  @Column({ nullable: true })
  foundedYear: number;

  @Column('text', { array: true, nullable: true })
  benefits: string[];

  @Column({ type: 'text', nullable: true })
  culture: string;

  @Column({ default: false })
  isVerified: boolean;
  
  @OneToMany(() => Job, job => job.company)
  jobs: Job[];

  @OneToMany(() => User, user => user.company)
  employees: User[]; 

  @Column()
  ownerId: string

  @ManyToOne(() => User, user => user.ownedCompanies)
  @JoinColumn({name: 'ownerId'})
  owner: User

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
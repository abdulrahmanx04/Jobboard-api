import { Controller, Get, Put,Post,Delete, UseGuards,Body, UseInterceptors, UploadedFile,NotFoundException, UploadedFiles, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import type { UserData } from '../common/interfaces/all.interfaces';
import { User } from '../common/decorators/current.user';
import { JwtAuthGuard } from '../common/guards/authguard';
import { UpdateProfileDto } from './dto/profile-user.dto';
import { PasswordDto } from '../auth/dto/create-auth.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

@Controller('users')
@UseGuards(JwtAuthGuard)
@Throttle({ default: { limit: 30, ttl: 60000 } })
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  findOne(@User() userData: UserData) {
    return this.usersService.findOne(userData)
  }

  @UseInterceptors(FileFieldsInterceptor([
    {name: 'avatar', maxCount: 1},
    {name: 'resume', maxCount: 1},
  ]))
  @Put('/me')
  updateOne(@Body() dto: UpdateProfileDto, @User() userData: UserData,
  @UploadedFiles() files?:{ avatar?: Express.Multer.File[], resume?: Express.Multer.File[]}) {
    return this.usersService.updateOne(dto,userData,files)
  }

  @Delete('/me')
  @HttpCode(204)
  deleteOne(@Body() dto: PasswordDto, @User() userData: UserData) {
    return this.usersService.deleteOne(dto,userData)
  }


} 
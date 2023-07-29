import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserInfoDTO } from 'src/user/userInfo.dto';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/types/user';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getProfile(@Request() req): Promise<User> {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async updateProfile(
    @Request() req,
    @Body() UserInfoDTO: UserInfoDTO,
  ): Promise<User> {
    const { id } = req.user;
    return this.userService.updateUser(id, UserInfoDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  async deleteProfile(@Request() req): Promise<User> {
    const { id } = req.user;
    return this.userService.deleteUser(id);
  }
}

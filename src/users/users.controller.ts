import { Controller, Get, Post, Body, Param, Req,  Res, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response, Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('name') name: string,
  ) {
    return this.usersService.create(email, password, name);
  }

  @Get(':email')
  async getUser(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post('login')
async login(@Req() req: Request, 
@Res() res: Response,
@Body() body: any) {
  const user = await this.usersService.validateUser(body.email, body.password);
  if (!user){
    req.session.userId ==null;
    throw new UnauthorizedException();
  }
  req.session.userId = user.id;
  return res.status(200).json({ ok: true, userId: user.id });

}
}

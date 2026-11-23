import { Controller, Get, Post, Put, Body, Param, Delete, Inject } from '@nestjs/common';
import { NIVEL_SERVICII_TOKEN } from './nivel-servicii.interface';
import type { INivelServicii } from './nivel-servicii.interface';
import {
  AddCreditsDto,
  CreateUserDto,
  GenerateAiDto,
  LoginDto,
  UpdatePlanDto,
  UpdateUserDto,
  UpgradeUserDto,
} from './dto';

@Controller('api')
export class AppController {
  constructor(@Inject(NIVEL_SERVICII_TOKEN) private readonly nivelServicii: INivelServicii) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.nivelServicii.login(body.email, body.parola);
  }

  // ==================== ADMIN: UTILIZATORI ====================
  @Get('admin/users')
  async getUsers() {
    return this.nivelServicii.getUsers();
  }

  @Post('admin/users')
  async createUser(@Body() body: CreateUserDto) {
    return this.nivelServicii.createUser(body);
  }

  @Put('admin/users/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.nivelServicii.updateUser(Number(id), body);
  }

  @Post('admin/users/:id/credits')
  async addCredits(@Param('id') id: string, @Body() body: AddCreditsDto) {
    return this.nivelServicii.addCredits(Number(id), body?.amount);
  }

  @Delete('admin/users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.nivelServicii.deleteUserWithHistory(Number(id));
  }

  // ==================== ADMIN: PLANURI ABONAMENT ====================
  @Get('plans')
  async getPlans() {
    return this.nivelServicii.getPlans();
  }

  @Put('admin/plans/:id')
  async updatePlan(@Param('id') id: string, @Body() body: UpdatePlanDto) {
    return this.nivelServicii.updatePlan(Number(id), body);
  }

  // ==================== ADMIN: ISTORIC AI & TRANZACTII ====================
  @Get('admin/conversii')
  async getAdminConversii() {
    return this.nivelServicii.getAdminConversii();
  }

  @Get('admin/tranzactii')
  async getAdminTranzactii() {
    return this.nivelServicii.getAdminTranzactii();
  }

  // ==================== USER DASHBOARD & AI ====================
  @Get('user/:id')
  async getUserDashboard(@Param('id') id: string) {
    return this.nivelServicii.getUserDashboard(Number(id));
  }

  @Post('user/upgrade')
  async upgradeUser(@Body() body: UpgradeUserDto) {
    return this.nivelServicii.upgradeUser(body.userId, body.id_abonament, body.crediteExtra);
  }

  @Post('user/generate-ai')
  async generateAi(@Body() body: GenerateAiDto) {
    return this.nivelServicii.generateAi(body.userId, body.tip_text, body.tema);
  }
}

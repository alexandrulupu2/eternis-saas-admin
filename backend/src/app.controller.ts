import { Controller, Get, Post, Put, Body, Param, Delete, Inject } from '@nestjs/common';
import { NIVEL_SERVICII_TOKEN } from './nivel-servicii.interface';
import type { INivelServicii } from './nivel-servicii.interface';

@Controller('api')
export class AppController {
  constructor(@Inject(NIVEL_SERVICII_TOKEN) private readonly nivelServicii: INivelServicii) {}

  @Post('login')
  async login(@Body() body: { email: string; parola: string }) {
    return this.nivelServicii.login(body.email, body.parola);
  }

  // ==================== ADMIN: UTILIZATORI ====================
  @Get('admin/users')
  async getUsers() {
    return this.nivelServicii.getUsers();
  }

  @Post('admin/users')
  async createUser(
    @Body()
    body: {
      email_utilizator: string;
      parola_hash: string;
      rol_utilizator: string;
      credite_disponibile: number;
      id_abonament?: number;
    },
  ) {
    return this.nivelServicii.createUser(body);
  }

  @Put('admin/users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body()
    body: {
      email_utilizator?: string;
      parola_hash?: string;
      rol_utilizator?: string;
      credite_disponibile?: number;
      id_abonament?: number;
    },
  ) {
    return this.nivelServicii.updateUser(Number(id), body);
  }

  @Post('admin/users/:id/credits')
  async addCredits(@Param('id') id: string, @Body() body: { amount?: number }) {
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
  async updatePlan(
    @Param('id') id: string,
    @Body() body: { nume_plan?: string; pret_simulat?: number; credite_lunare?: number },
  ) {
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
  async upgradeUser(@Body() body: { userId: number; id_abonament?: number; crediteExtra: number }) {
    return this.nivelServicii.upgradeUser(Number(body.userId), body.id_abonament, body.crediteExtra);
  }

  @Post('user/generate-ai')
  async generateAi(@Body() body: { userId: number; tip_text: string; tema: string }) {
    return this.nivelServicii.generateAi(Number(body.userId), body.tip_text, body.tema);
  }
}



import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('api')
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: { email: string; parola: string }) {
    const { email, parola } = body;
    if (!email || !parola) {
      return { success: false, message: 'Vă rugăm să completați toate câmpurile!' };
    }

    const user = await this.prisma.utilizatori.findFirst({
      where: { email_utilizator: email },
      include: { abonamente: true },
    });

    if (!user) {
      return { success: false, message: 'Nu există niciun cont cu acest email!' };
    }

    if (user.parola_hash !== parola) {
      return { success: false, message: 'Parola introdusă este incorectă!' };
    }

    return {
      success: true,
      role: user.rol_utilizator,
      userId: user.id_utilizator,
    };
  }

  @Get('admin/users')
  async getUsers() {
    return await this.prisma.utilizatori.findMany({
      include: { abonamente: true },
      orderBy: { id_utilizator: 'asc' },
    });
  }

  @Post('admin/users')
  async createUser(@Body() body: { email_utilizator: string; parola_hash: string; rol_utilizator: string; credite_disponibile: number }) {
    const defaultPlan = await this.prisma.abonamente.findFirst();
    return await this.prisma.utilizatori.create({
      data: {
        email_utilizator: body.email_utilizator,
        parola_hash: body.parola_hash,
        rol_utilizator: body.rol_utilizator || 'USER',
        credite_disponibile: Number(body.credite_disponibile) || 15,
        id_abonament: defaultPlan ? defaultPlan.id_abonament : 1,
      },
    });
  }

  @Post('admin/users/:id/credits')
  async addCredits(@Param('id') id: string, @Body() body: { amount?: number }) {
    const amountToAdd = Number(body?.amount) > 0 ? Number(body.amount) : 10;
    return await this.prisma.utilizatori.update({
      where: { id_utilizator: Number(id) },
      data: { credite_disponibile: { increment: amountToAdd } },
    });
  }

  @Delete('admin/users/:id')
  async deleteUser(@Param('id') id: string) {
    return await this.prisma.utilizatori.delete({
      where: { id_utilizator: Number(id) },
    });
  }

  @Get('user/:id')
  async getUserDashboard(@Param('id') id: string) {
    return await this.prisma.utilizatori.findUnique({
      where: { id_utilizator: Number(id) || 2 },
      include: { abonamente: true },
    });
  }

  @Get('plans')
  async getPlans() {
    return await this.prisma.abonamente.findMany({
      orderBy: { id_abonament: 'asc' },
    });
  }

  @Post('user/upgrade')
  async upgradeUser(@Body() body: { userId: number; id_abonament?: number; crediteExtra: number }) {
    const dataToUpdate: any = {
      credite_disponibile: { increment: Number(body.crediteExtra) || 0 },
    };

    if (body.id_abonament) {
      dataToUpdate.id_abonament = Number(body.id_abonament);
    }

    const updated = await this.prisma.utilizatori.update({
      where: { id_utilizator: Number(body.userId) },
      data: dataToUpdate,
      include: { abonamente: true },
    });

    return {
      success: true,
      user: updated,
    };
  }

  @Post('user/generate-ai')
  async generateAi(@Body() body: { userId: number; tip_text: string; tema: string }) {
    const user = await this.prisma.utilizatori.findUnique({
      where: { id_utilizator: Number(body.userId) },
    });

    if (!user || user.credite_disponibile <= 0) {
      return { success: false, message: 'Credite AI insuficiente!' };
    }

    const updated = await this.prisma.utilizatori.update({
      where: { id_utilizator: Number(body.userId) },
      data: { credite_disponibile: { decrement: 1 } },
    });

    const texte: Record<string, string> = {
      predica: `Iubiți credincioși,\n\nAstăzi medităm asupra temei „${body.tema}”. În lumina credinței creștine, fiecare încercare devine o chemare la iubire, iertare și nădejde în viața veșnică. Să păstrăm pacea în suflete și în familiile noastre.\n\nAmin.`,
      necrolog: `Cu adâncă durere în suflet, ne luăm rămas bun de la cel plecat pe drumul veșniciei. Amintirea și bunătatea sa vor rămâne pururea vii în inimile noastre (${body.tema}). Dumnezeu să-l odihnească în pace!`,
      anunt: `ANUNȚ PAROHIAL:\nVă aducem la cunoștință organizarea activității parohiale cu tema: „${body.tema}”. Vă așteptăm cu drag alături de comunitatea noastră!`,
    };

    return {
      success: true,
      text: texte[body.tip_text] || texte.predica,
      crediteRamase: updated.credite_disponibile,
    };
  }
}

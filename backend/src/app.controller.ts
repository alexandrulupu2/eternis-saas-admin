import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
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

  // ==================== ADMIN: UTILIZATORI ====================
  @Get('admin/users')
  async getUsers() {
    return await this.prisma.utilizatori.findMany({
      include: { abonamente: true },
      orderBy: { id_utilizator: 'asc' },
    });
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
    const defaultPlan = await this.prisma.abonamente.findFirst();
    return await this.prisma.utilizatori.create({
      data: {
        email_utilizator: body.email_utilizator,
        parola_hash: body.parola_hash,
        rol_utilizator: body.rol_utilizator || 'USER',
        credite_disponibile: Number(body.credite_disponibile) || 15,
        id_abonament: body.id_abonament ? Number(body.id_abonament) : defaultPlan ? defaultPlan.id_abonament : 1,
      },
    });
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
    const dataToUpdate: any = {};
    if (body.email_utilizator) dataToUpdate.email_utilizator = body.email_utilizator;
    if (body.parola_hash && body.parola_hash.trim() !== '') dataToUpdate.parola_hash = body.parola_hash;
    if (body.rol_utilizator) dataToUpdate.rol_utilizator = body.rol_utilizator;
    if (body.credite_disponibile !== undefined) dataToUpdate.credite_disponibile = Number(body.credite_disponibile);
    if (body.id_abonament !== undefined) dataToUpdate.id_abonament = Number(body.id_abonament);

    return await this.prisma.utilizatori.update({
      where: { id_utilizator: Number(id) },
      data: dataToUpdate,
      include: { abonamente: true },
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
    const userId = Number(id);
    await this.prisma.conversii_ai.deleteMany({ where: { id_utilizator: userId } });
    await this.prisma.tranzactii_simulate.deleteMany({ where: { id_utilizator: userId } });
    return await this.prisma.utilizatori.delete({
      where: { id_utilizator: userId },
    });
  }

  // ==================== ADMIN: PLANURI ABONAMENT ====================
  @Get('plans')
  async getPlans() {
    return await this.prisma.abonamente.findMany({
      orderBy: { id_abonament: 'asc' },
    });
  }

  @Put('admin/plans/:id')
  async updatePlan(
    @Param('id') id: string,
    @Body() body: { nume_plan?: string; pret_simulat?: number; credite_lunare?: number },
  ) {
    const dataToUpdate: any = {};
    if (body.nume_plan !== undefined) dataToUpdate.nume_plan = body.nume_plan;
    if (body.pret_simulat !== undefined) dataToUpdate.pret_simulat = Number(body.pret_simulat);
    if (body.credite_lunare !== undefined) dataToUpdate.credite_lunare = Number(body.credite_lunare);

    return await this.prisma.abonamente.update({
      where: { id_abonament: Number(id) },
      data: dataToUpdate,
    });
  }

  // ==================== ADMIN: ISTORIC AI & TRANZACTII ====================
  @Get('admin/conversii')
  async getAdminConversii() {
    return await this.prisma.conversii_ai.findMany({
      include: {
        utilizatori: {
          select: { email_utilizator: true },
        },
      },
      orderBy: { id_conversie: 'desc' },
      take: 50,
    });
  }

  @Get('admin/tranzactii')
  async getAdminTranzactii() {
    return await this.prisma.tranzactii_simulate.findMany({
      include: {
        utilizatori: {
          select: { email_utilizator: true },
        },
        abonamente: {
          select: { nume_plan: true },
        },
      },
      orderBy: { id_tranzactie: 'desc' },
      take: 50,
    });
  }

  // ==================== USER DASHBOARD & AI ====================
  @Get('user/:id')
  async getUserDashboard(@Param('id') id: string) {
    return await this.prisma.utilizatori.findUnique({
      where: { id_utilizator: Number(id) || 2 },
      include: { abonamente: true },
    });
  }

  @Post('user/upgrade')
  async upgradeUser(@Body() body: { userId: number; id_abonament?: number; crediteExtra: number }) {
    const userId = Number(body.userId);
    const crediteExtra = Number(body.crediteExtra) || 0;
    const dataToUpdate: any = {
      credite_disponibile: { increment: crediteExtra },
    };

    let planPret = 0;
    if (body.id_abonament) {
      dataToUpdate.id_abonament = Number(body.id_abonament);
      const plan = await this.prisma.abonamente.findUnique({
        where: { id_abonament: Number(body.id_abonament) },
      });
      if (plan && plan.pret_simulat) {
        planPret = Number(plan.pret_simulat);
      }
    }

    const updated = await this.prisma.utilizatori.update({
      where: { id_utilizator: userId },
      data: dataToUpdate,
      include: { abonamente: true },
    });

    await this.prisma.tranzactii_simulate.create({
      data: {
        id_utilizator: userId,
        id_abonament: body.id_abonament ? Number(body.id_abonament) : updated.id_abonament,
        suma_simulata: planPret > 0 ? planPret : 25,
        credite_adaugate: crediteExtra,
        status_tranzactie: 'FINALIZATA',
      },
    });

    return {
      success: true,
      user: updated,
    };
  }

  @Post('user/generate-ai')
  async generateAi(@Body() body: { userId: number; tip_text: string; tema: string }) {
    const userId = Number(body.userId);
    const user = await this.prisma.utilizatori.findUnique({
      where: { id_utilizator: userId },
    });

    if (!user || user.credite_disponibile <= 0) {
      return { success: false, message: 'Credite AI insuficiente!' };
    }

    const updated = await this.prisma.utilizatori.update({
      where: { id_utilizator: userId },
      data: { credite_disponibile: { decrement: 1 } },
    });

    const texte: Record<string, string> = {
      predica: `Iubiți credincioși,\n\nAstăzi medităm asupra temei „${body.tema}”. În lumina credinței creștine, fiecare încercare devine o chemare la iubire, iertare și nădejde în viața veșnică. Să păstrăm pacea în suflete și în familiile noastre.\n\nAmin.`,
      necrolog: `Cu adâncă durere în suflet, ne luăm rămas bun de la cel plecat pe drumul veșniciei. Amintirea și bunătatea sa vor rămâne pururea vii în inimile noastre (${body.tema}). Dumnezeu să-l odihnească în pace!`,
      anunt: `ANUNȚ PAROHIAL:\nVă aducem la cunoștință organizarea activității parohiale cu tema: „${body.tema}”. Vă așteptăm cu drag alături de comunitatea noastră!`,
    };

    const generatedText = texte[body.tip_text] || texte.predica;

    await this.prisma.conversii_ai.create({
      data: {
        id_utilizator: userId,
        tip_conversie: (body.tip_text || 'PREDICA').toUpperCase(),
        prompt_input: body.tema || 'Fără temă specificată',
        rezultat_output: generatedText,
        credite_consumate: 1,
      },
    });

    return {
      success: true,
      text: generatedText,
      crediteRamase: updated.credite_disponibile,
    };
  }
}

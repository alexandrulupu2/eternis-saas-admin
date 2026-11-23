import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class NivelServicii {
  constructor(private readonly prisma: PrismaService) {}

  // ==================== AUTENTIFICARE ====================
  async login(email: string, parola: string) {
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

  // ==================== UTILIZATORI ====================
  async getUsers() {
    return await this.prisma.utilizatori.findMany({
      include: { abonamente: true },
      orderBy: { id_utilizator: 'asc' },
    });
  }

  async getFormattedUsersForMvc() {
    const users = await this.getUsers();
    const formattedUsers = users.map((u) => ({
      ...u,
      planName: u.abonamente ? u.abonamente.nume_plan : 'Plan Free',
    }));

    return {
      users: formattedUsers,
      totalUsers: formattedUsers.length,
    };
  }

  async createUser(data: {
    email_utilizator: string;
    parola_hash: string;
    rol_utilizator?: string;
    credite_disponibile?: number | string;
    id_abonament?: number;
  }) {
    const defaultPlan = await this.prisma.abonamente.findFirst();
    return await this.prisma.utilizatori.create({
      data: {
        email_utilizator: data.email_utilizator,
        parola_hash: data.parola_hash,
        rol_utilizator: data.rol_utilizator || 'USER',
        credite_disponibile: Number(data.credite_disponibile) || 15,
        id_abonament: data.id_abonament
          ? Number(data.id_abonament)
          : defaultPlan
          ? defaultPlan.id_abonament
          : 1,
      },
    });
  }

  async updateUser(
    id: number,
    data: {
      email_utilizator?: string;
      parola_hash?: string;
      rol_utilizator?: string;
      credite_disponibile?: number;
      id_abonament?: number;
    },
  ) {
    const dataToUpdate: any = {};
    if (data.email_utilizator) dataToUpdate.email_utilizator = data.email_utilizator;
    if (data.parola_hash && data.parola_hash.trim() !== '') dataToUpdate.parola_hash = data.parola_hash;
    if (data.rol_utilizator) dataToUpdate.rol_utilizator = data.rol_utilizator;
    if (data.credite_disponibile !== undefined) dataToUpdate.credite_disponibile = Number(data.credite_disponibile);
    if (data.id_abonament !== undefined) dataToUpdate.id_abonament = Number(data.id_abonament);

    return await this.prisma.utilizatori.update({
      where: { id_utilizator: id },
      data: dataToUpdate,
      include: { abonamente: true },
    });
  }

  async addCredits(id: number, amount?: number | string) {
    const amountToAdd = Number(amount) > 0 ? Number(amount) : 10;
    return await this.prisma.utilizatori.update({
      where: { id_utilizator: id },
      data: { credite_disponibile: { increment: amountToAdd } },
    });
  }

  async deleteUserWithHistory(id: number) {
    await this.prisma.conversii_ai.deleteMany({ where: { id_utilizator: id } });
    await this.prisma.tranzactii_simulate.deleteMany({ where: { id_utilizator: id } });
    return await this.prisma.utilizatori.delete({
      where: { id_utilizator: id },
    });
  }

  // ==================== PLANURI ABONAMENT ====================
  async getPlans() {
    return await this.prisma.abonamente.findMany({
      orderBy: { id_abonament: 'asc' },
    });
  }

  async updatePlan(
    id: number,
    data: { nume_plan?: string; pret_simulat?: number; credite_lunare?: number },
  ) {
    const dataToUpdate: any = {};
    if (data.nume_plan !== undefined) dataToUpdate.nume_plan = data.nume_plan;
    if (data.pret_simulat !== undefined) dataToUpdate.pret_simulat = Number(data.pret_simulat);
    if (data.credite_lunare !== undefined) dataToUpdate.credite_lunare = Number(data.credite_lunare);

    return await this.prisma.abonamente.update({
      where: { id_abonament: id },
      data: dataToUpdate,
    });
  }

  // ==================== ISTORIC AI & TRANZACTII ====================
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

  // ==================== USER DASHBOARD & GENERARE AI ====================
  async getUserDashboard(id: number) {
    return await this.prisma.utilizatori.findUnique({
      where: { id_utilizator: id || 2 },
      include: { abonamente: true },
    });
  }

  async upgradeUser(userId: number, id_abonament: number | undefined, crediteExtra: number) {
    const extra = Number(crediteExtra) || 0;
    const dataToUpdate: any = {
      credite_disponibile: { increment: extra },
    };

    let planPret = 0;
    if (id_abonament) {
      dataToUpdate.id_abonament = Number(id_abonament);
      const plan = await this.prisma.abonamente.findUnique({
        where: { id_abonament: Number(id_abonament) },
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
        id_abonament: id_abonament ? Number(id_abonament) : updated.id_abonament,
        suma_simulata: planPret > 0 ? planPret : 25,
        credite_adaugate: extra,
        status_tranzactie: 'FINALIZATA',
      },
    });

    return {
      success: true,
      user: updated,
    };
  }

  async generateAi(userId: number, tip_text: string, tema: string) {
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
      predica: `Iubiți credincioși,\n\nAstăzi medităm asupra temei „${tema}”. În lumina învățăturii creștine, fiecare zi este un prilej de apropiere de Dumnezeu și de aproapele nostru prin rugăciune, răbdare și fapte bune.\n\nAmin.`,
      rugaciune: `Doamne, Dumnezeul nostru, Primește rugăciunea noastră pentru „${tema}”. Dăruiește-ne pace, înțelepciune și întărire sufletească în toate zilele vieții noastre.\n\nAmin.`,
      anunt: `ANUNȚ PAROHIAL — ${tema.toUpperCase()}\n\nDragi credincioși, vă aducem la cunoștință programul și detaliile organizatorice privind: ${tema}. Vă așteptăm cu drag la sfânta biserică!`,
    };

    const rezultat =
      texte[tip_text] ||
      `Material pastoral generat pe tema „${tema}” (${tip_text}). Binecuvântare și pace în parohia dumneavoastră!`;

    await this.prisma.conversii_ai.create({
      data: {
        id_utilizator: userId,
        tip_conversie: tip_text || 'predica',
        prompt_input: tema,
        rezultat_output: rezultat,
        credite_consumate: 1,
      },
    });

    return {
      success: true,
      rezultat,
      crediteRamase: updated.credite_disponibile,
    };
  }
}


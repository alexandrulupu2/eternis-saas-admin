import { Controller, Get, Post, Body, Param, Render, Redirect } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('admin')
export class AdminMvcController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @Render('admin')
  async getAdminPage() {
    const users = await this.prisma.utilizatori.findMany({
      include: { abonamente: true },
      orderBy: { id_utilizator: 'asc' },
    });

    const formattedUsers = users.map((u) => ({
      ...u,
      planName: u.abonamente ? u.abonamente.nume_plan : 'Plan Free',
    }));

    return {
      users: formattedUsers,
      totalUsers: formattedUsers.length,
    };
  }

  @Post('users/create')
  @Redirect('/admin')
  async createUser(
    @Body() body: { email_utilizator: string; parola_hash: string; credite_disponibile: string },
  ) {
    const defaultPlan = await this.prisma.abonamente.findFirst();
    await this.prisma.utilizatori.create({
      data: {
        email_utilizator: body.email_utilizator,
        parola_hash: body.parola_hash,
        rol_utilizator: 'USER',
        credite_disponibile: Number(body.credite_disponibile) || 15,
        id_abonament: defaultPlan ? defaultPlan.id_abonament : 1,
      },
    });
  }

  @Post('users/:id/credits')
  @Redirect('/admin')
  async addCustomCredits(@Param('id') id: string, @Body() body: { amount: string }) {
    const amountToAdd = Number(body.amount) > 0 ? Number(body.amount) : 10;
    await this.prisma.utilizatori.update({
      where: { id_utilizator: Number(id) },
      data: { credite_disponibile: { increment: amountToAdd } },
    });
  }

  @Post('users/:id/delete')
  @Redirect('/admin')
  async deleteUser(@Param('id') id: string) {
    await this.prisma.utilizatori.delete({
      where: { id_utilizator: Number(id) },
    });
  }
}

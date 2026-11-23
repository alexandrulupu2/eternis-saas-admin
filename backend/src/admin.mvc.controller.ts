import { Controller, Get, Post, Body, Param, Render, Redirect } from '@nestjs/common';
import { NivelServicii } from './nivel-servicii.service';

@Controller('admin')
export class AdminMvcController {
  constructor(private readonly nivelServicii: NivelServicii) {}

  @Get()
  @Render('admin')
  async getAdminPage() {
    return this.nivelServicii.getFormattedUsersForMvc();
  }

  @Post('users/create')
  @Redirect('/admin')
  async createUser(
    @Body() body: { email_utilizator: string; parola_hash: string; credite_disponibile: string },
  ) {
    await this.nivelServicii.createUser(body);
  }

  @Post('users/:id/credits')
  @Redirect('/admin')
  async addCustomCredits(@Param('id') id: string, @Body() body: { amount: string }) {
    await this.nivelServicii.addCredits(Number(id), body.amount);
  }

  @Post('users/:id/delete')
  @Redirect('/admin')
  async deleteUser(@Param('id') id: string) {
    await this.nivelServicii.deleteUserWithHistory(Number(id));
  }
}

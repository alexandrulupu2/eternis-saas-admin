import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminMvcController } from './admin.mvc.controller';
import { PrismaService } from './prisma.service';
import { NivelServicii } from './nivel-servicii.service';

@Module({
  imports: [],
  controllers: [AppController, AdminMvcController],
  providers: [PrismaService, NivelServicii],
})
export class AppModule {}

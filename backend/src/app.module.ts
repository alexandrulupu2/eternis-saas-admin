import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AdminMvcController } from './admin.mvc.controller';
import { PrismaService } from './prisma.service';
import { NivelServicii } from './nivel-servicii.service';
import { NIVEL_SERVICII_TOKEN } from './nivel-servicii.interface';

@Module({
  imports: [],
  controllers: [AppController, AdminMvcController],
  providers: [
    PrismaService,
    {
      provide: NIVEL_SERVICII_TOKEN,
      useClass: NivelServicii,
    },
  ],
})
export class AppModule {}

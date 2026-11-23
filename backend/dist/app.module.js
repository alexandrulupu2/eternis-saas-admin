"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const admin_mvc_controller_1 = require("./admin.mvc.controller");
const prisma_service_1 = require("./prisma.service");
const nivel_servicii_service_1 = require("./nivel-servicii.service");
const nivel_servicii_interface_1 = require("./nivel-servicii.interface");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController, admin_mvc_controller_1.AdminMvcController],
        providers: [
            prisma_service_1.PrismaService,
            {
                provide: nivel_servicii_interface_1.NIVEL_SERVICII_TOKEN,
                useClass: nivel_servicii_service_1.NivelServicii,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminMvcController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let AdminMvcController = class AdminMvcController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
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
    async createUser(body) {
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
    async addCustomCredits(id, body) {
        const amountToAdd = Number(body.amount) > 0 ? Number(body.amount) : 10;
        await this.prisma.utilizatori.update({
            where: { id_utilizator: Number(id) },
            data: { credite_disponibile: { increment: amountToAdd } },
        });
    }
    async deleteUser(id) {
        await this.prisma.utilizatori.delete({
            where: { id_utilizator: Number(id) },
        });
    }
};
exports.AdminMvcController = AdminMvcController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminMvcController.prototype, "getAdminPage", null);
__decorate([
    (0, common_1.Post)('users/create'),
    (0, common_1.Redirect)('/admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminMvcController.prototype, "createUser", null);
__decorate([
    (0, common_1.Post)('users/:id/credits'),
    (0, common_1.Redirect)('/admin'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminMvcController.prototype, "addCustomCredits", null);
__decorate([
    (0, common_1.Post)('users/:id/delete'),
    (0, common_1.Redirect)('/admin'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminMvcController.prototype, "deleteUser", null);
exports.AdminMvcController = AdminMvcController = __decorate([
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminMvcController);
//# sourceMappingURL=admin.mvc.controller.js.map
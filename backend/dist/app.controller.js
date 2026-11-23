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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const nivel_servicii_interface_1 = require("./nivel-servicii.interface");
let AppController = class AppController {
    nivelServicii;
    constructor(nivelServicii) {
        this.nivelServicii = nivelServicii;
    }
    async login(body) {
        return this.nivelServicii.login(body.email, body.parola);
    }
    async getUsers() {
        return this.nivelServicii.getUsers();
    }
    async createUser(body) {
        return this.nivelServicii.createUser(body);
    }
    async updateUser(id, body) {
        return this.nivelServicii.updateUser(Number(id), body);
    }
    async addCredits(id, body) {
        return this.nivelServicii.addCredits(Number(id), body?.amount);
    }
    async deleteUser(id) {
        return this.nivelServicii.deleteUserWithHistory(Number(id));
    }
    async getPlans() {
        return this.nivelServicii.getPlans();
    }
    async updatePlan(id, body) {
        return this.nivelServicii.updatePlan(Number(id), body);
    }
    async getAdminConversii() {
        return this.nivelServicii.getAdminConversii();
    }
    async getAdminTranzactii() {
        return this.nivelServicii.getAdminTranzactii();
    }
    async getUserDashboard(id) {
        return this.nivelServicii.getUserDashboard(Number(id));
    }
    async upgradeUser(body) {
        return this.nivelServicii.upgradeUser(Number(body.userId), body.id_abonament, body.crediteExtra);
    }
    async generateAi(body) {
        return this.nivelServicii.generateAi(Number(body.userId), body.tip_text, body.tema);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('admin/users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('admin/users'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createUser", null);
__decorate([
    (0, common_1.Put)('admin/users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('admin/users/:id/credits'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "addCredits", null);
__decorate([
    (0, common_1.Delete)('admin/users/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)('plans'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPlans", null);
__decorate([
    (0, common_1.Put)('admin/plans/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updatePlan", null);
__decorate([
    (0, common_1.Get)('admin/conversii'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminConversii", null);
__decorate([
    (0, common_1.Get)('admin/tranzactii'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAdminTranzactii", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUserDashboard", null);
__decorate([
    (0, common_1.Post)('user/upgrade'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "upgradeUser", null);
__decorate([
    (0, common_1.Post)('user/generate-ai'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "generateAi", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('api'),
    __param(0, (0, common_1.Inject)(nivel_servicii_interface_1.NIVEL_SERVICII_TOKEN)),
    __metadata("design:paramtypes", [Object])
], AppController);
//# sourceMappingURL=app.controller.js.map
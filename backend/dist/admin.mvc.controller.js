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
const nivel_servicii_service_1 = require("./nivel-servicii.service");
let AdminMvcController = class AdminMvcController {
    nivelServicii;
    constructor(nivelServicii) {
        this.nivelServicii = nivelServicii;
    }
    async getAdminPage() {
        return this.nivelServicii.getFormattedUsersForMvc();
    }
    async createUser(body) {
        await this.nivelServicii.createUser(body);
    }
    async addCustomCredits(id, body) {
        await this.nivelServicii.addCredits(Number(id), body.amount);
    }
    async deleteUser(id) {
        await this.nivelServicii.deleteUserWithHistory(Number(id));
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
    __metadata("design:paramtypes", [nivel_servicii_service_1.NivelServicii])
], AdminMvcController);
//# sourceMappingURL=admin.mvc.controller.js.map
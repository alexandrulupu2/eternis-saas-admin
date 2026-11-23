import type { INivelServicii } from './nivel-servicii.interface';
import { AddCreditsDto, CreateUserDto, GenerateAiDto, LoginDto, UpdatePlanDto, UpdateUserDto, UpgradeUserDto } from './dto';
export declare class AppController {
    private readonly nivelServicii;
    constructor(nivelServicii: INivelServicii);
    login(body: LoginDto): Promise<any>;
    getUsers(): Promise<any[]>;
    createUser(body: CreateUserDto): Promise<any>;
    updateUser(id: string, body: UpdateUserDto): Promise<any>;
    addCredits(id: string, body: AddCreditsDto): Promise<any>;
    deleteUser(id: string): Promise<any>;
    getPlans(): Promise<any[]>;
    updatePlan(id: string, body: UpdatePlanDto): Promise<any>;
    getAdminConversii(): Promise<any[]>;
    getAdminTranzactii(): Promise<any[]>;
    getUserDashboard(id: string): Promise<any>;
    upgradeUser(body: UpgradeUserDto): Promise<any>;
    generateAi(body: GenerateAiDto): Promise<any>;
}

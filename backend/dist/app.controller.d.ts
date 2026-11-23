import type { INivelServicii } from './nivel-servicii.interface';
export declare class AppController {
    private readonly nivelServicii;
    constructor(nivelServicii: INivelServicii);
    login(body: {
        email: string;
        parola: string;
    }): Promise<any>;
    getUsers(): Promise<any[]>;
    createUser(body: {
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        credite_disponibile: number;
        id_abonament?: number;
    }): Promise<any>;
    updateUser(id: string, body: {
        email_utilizator?: string;
        parola_hash?: string;
        rol_utilizator?: string;
        credite_disponibile?: number;
        id_abonament?: number;
    }): Promise<any>;
    addCredits(id: string, body: {
        amount?: number;
    }): Promise<any>;
    deleteUser(id: string): Promise<any>;
    getPlans(): Promise<any[]>;
    updatePlan(id: string, body: {
        nume_plan?: string;
        pret_simulat?: number;
        credite_lunare?: number;
    }): Promise<any>;
    getAdminConversii(): Promise<any[]>;
    getAdminTranzactii(): Promise<any[]>;
    getUserDashboard(id: string): Promise<any>;
    upgradeUser(body: {
        userId: number;
        id_abonament?: number;
        crediteExtra: number;
    }): Promise<any>;
    generateAi(body: {
        userId: number;
        tip_text: string;
        tema: string;
    }): Promise<any>;
}

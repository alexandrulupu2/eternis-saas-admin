import { PrismaService } from './prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(body: {
        email: string;
        parola: string;
    }): Promise<{
        success: boolean;
        message: string;
        role?: undefined;
        userId?: undefined;
    } | {
        success: boolean;
        role: string;
        userId: number;
        message?: undefined;
    }>;
    getUsers(): Promise<({
        abonamente: {
            id_abonament: number;
            nume_plan: string;
            credite_lunare: number;
            pret_simulat: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id_utilizator: number;
        id_client: number | null;
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        id_abonament: number;
        credite_disponibile: number;
        data_creare: Date;
    })[]>;
    createUser(body: {
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        credite_disponibile: number;
    }): Promise<{
        id_utilizator: number;
        id_client: number | null;
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        id_abonament: number;
        credite_disponibile: number;
        data_creare: Date;
    }>;
    addCredits(id: string, body: {
        amount?: number;
    }): Promise<{
        id_utilizator: number;
        id_client: number | null;
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        id_abonament: number;
        credite_disponibile: number;
        data_creare: Date;
    }>;
    deleteUser(id: string): Promise<{
        id_utilizator: number;
        id_client: number | null;
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        id_abonament: number;
        credite_disponibile: number;
        data_creare: Date;
    }>;
    getUserDashboard(id: string): Promise<({
        abonamente: {
            id_abonament: number;
            nume_plan: string;
            credite_lunare: number;
            pret_simulat: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id_utilizator: number;
        id_client: number | null;
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        id_abonament: number;
        credite_disponibile: number;
        data_creare: Date;
    }) | null>;
    getPlans(): Promise<{
        id_abonament: number;
        nume_plan: string;
        credite_lunare: number;
        pret_simulat: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    upgradeUser(body: {
        userId: number;
        id_abonament?: number;
        crediteExtra: number;
    }): Promise<{
        success: boolean;
        user: {
            abonamente: {
                id_abonament: number;
                nume_plan: string;
                credite_lunare: number;
                pret_simulat: import("@prisma/client/runtime/library").Decimal;
            };
        } & {
            id_utilizator: number;
            id_client: number | null;
            email_utilizator: string;
            parola_hash: string;
            rol_utilizator: string;
            id_abonament: number;
            credite_disponibile: number;
            data_creare: Date;
        };
    }>;
    generateAi(body: {
        userId: number;
        tip_text: string;
        tema: string;
    }): Promise<{
        success: boolean;
        message: string;
        text?: undefined;
        crediteRamase?: undefined;
    } | {
        success: boolean;
        text: string;
        crediteRamase: number;
        message?: undefined;
    }>;
}

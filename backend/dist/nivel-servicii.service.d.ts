import { PrismaService } from './prisma.service';
import { INivelServicii } from './nivel-servicii.interface';
export declare class NivelServicii implements INivelServicii {
    private readonly prisma;
    constructor(prisma: PrismaService);
    login(email: string, parola: string): Promise<{
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
    getFormattedUsersForMvc(): Promise<{
        users: {
            planName: string;
            abonamente: {
                id_abonament: number;
                nume_plan: string;
                credite_lunare: number;
                pret_simulat: import("@prisma/client/runtime/library").Decimal;
            };
            id_utilizator: number;
            id_client: number | null;
            email_utilizator: string;
            parola_hash: string;
            rol_utilizator: string;
            id_abonament: number;
            credite_disponibile: number;
            data_creare: Date;
        }[];
        totalUsers: number;
    }>;
    createUser(data: {
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator?: string;
        credite_disponibile?: number | string;
        id_abonament?: number;
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
    updateUser(id: number, data: {
        email_utilizator?: string;
        parola_hash?: string;
        rol_utilizator?: string;
        credite_disponibile?: number;
        id_abonament?: number;
    }): Promise<{
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
    }>;
    addCredits(id: number, amount?: number | string): Promise<{
        id_utilizator: number;
        id_client: number | null;
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        id_abonament: number;
        credite_disponibile: number;
        data_creare: Date;
    }>;
    deleteUserWithHistory(id: number): Promise<{
        id_utilizator: number;
        id_client: number | null;
        email_utilizator: string;
        parola_hash: string;
        rol_utilizator: string;
        id_abonament: number;
        credite_disponibile: number;
        data_creare: Date;
    }>;
    getPlans(): Promise<{
        id_abonament: number;
        nume_plan: string;
        credite_lunare: number;
        pret_simulat: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    updatePlan(id: number, data: {
        nume_plan?: string;
        pret_simulat?: number;
        credite_lunare?: number;
    }): Promise<{
        id_abonament: number;
        nume_plan: string;
        credite_lunare: number;
        pret_simulat: import("@prisma/client/runtime/library").Decimal;
    }>;
    getAdminConversii(): Promise<({
        utilizatori: {
            email_utilizator: string;
        };
    } & {
        id_utilizator: number;
        id_conversie: number;
        id_decedat: number | null;
        tip_conversie: string;
        prompt_input: string;
        rezultat_output: string;
        credite_consumate: number;
        data_conversie: Date;
    })[]>;
    getAdminTranzactii(): Promise<({
        utilizatori: {
            email_utilizator: string;
        };
        abonamente: {
            nume_plan: string;
        };
    } & {
        id_utilizator: number;
        id_abonament: number;
        id_tranzactie: number;
        suma_simulata: import("@prisma/client/runtime/library").Decimal;
        credite_adaugate: number;
        status_tranzactie: string;
        data_tranzactie: Date;
    })[]>;
    getUserDashboard(id: number): Promise<({
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
    upgradeUser(userId: number, id_abonament: number | undefined, crediteExtra: number): Promise<{
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
    generateAi(userId: number, tip_text: string, tema: string): Promise<{
        success: boolean;
        message: string;
        rezultat?: undefined;
        crediteRamase?: undefined;
    } | {
        success: boolean;
        rezultat: string;
        crediteRamase: number;
        message?: undefined;
    }>;
}

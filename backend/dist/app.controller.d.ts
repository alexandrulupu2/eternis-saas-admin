import { NivelServicii } from './nivel-servicii.service';
export declare class AppController {
    private readonly nivelServicii;
    constructor(nivelServicii: NivelServicii);
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
    updateUser(id: string, body: {
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
    getPlans(): Promise<{
        id_abonament: number;
        nume_plan: string;
        credite_lunare: number;
        pret_simulat: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    updatePlan(id: string, body: {
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
        rezultat?: undefined;
        crediteRamase?: undefined;
    } | {
        success: boolean;
        rezultat: string;
        crediteRamase: number;
        message?: undefined;
    }>;
}

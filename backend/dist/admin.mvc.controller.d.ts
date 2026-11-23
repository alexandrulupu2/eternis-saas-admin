import { NivelServicii } from './nivel-servicii.service';
export declare class AdminMvcController {
    private readonly nivelServicii;
    constructor(nivelServicii: NivelServicii);
    getAdminPage(): Promise<{
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
    createUser(body: {
        email_utilizator: string;
        parola_hash: string;
        credite_disponibile: string;
    }): Promise<void>;
    addCustomCredits(id: string, body: {
        amount: string;
    }): Promise<void>;
    deleteUser(id: string): Promise<void>;
}

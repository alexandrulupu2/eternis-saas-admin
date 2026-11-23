import type { INivelServicii } from './nivel-servicii.interface';
export declare class AdminMvcController {
    private readonly nivelServicii;
    constructor(nivelServicii: INivelServicii);
    getAdminPage(): Promise<{
        users: any[];
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

export declare class CreateUserDto {
    email_utilizator: string;
    parola_hash: string;
    rol_utilizator?: string;
    credite_disponibile?: number;
    id_abonament?: number;
}
export declare class UpdateUserDto {
    email_utilizator?: string;
    parola_hash?: string;
    rol_utilizator?: string;
    credite_disponibile?: number;
    id_abonament?: number;
}
export declare class AddCreditsDto {
    amount?: number;
}
export declare class UpgradeUserDto {
    userId: number;
    id_abonament?: number;
    crediteExtra: number;
}

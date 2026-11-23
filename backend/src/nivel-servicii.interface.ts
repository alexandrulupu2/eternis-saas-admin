export const NIVEL_SERVICII_TOKEN = 'NIVEL_SERVICII_TOKEN';

export interface INivelServicii {
  login(email: string, parola: string): Promise<any>;

  getUsers(): Promise<any[]>;
  getFormattedUsersForMvc(): Promise<{ users: any[]; totalUsers: number }>;
  createUser(data: {
    email_utilizator: string;
    parola_hash: string;
    rol_utilizator?: string;
    credite_disponibile?: number | string;
    id_abonament?: number;
  }): Promise<any>;
  updateUser(
    id: number,
    data: {
      email_utilizator?: string;
      parola_hash?: string;
      rol_utilizator?: string;
      credite_disponibile?: number;
      id_abonament?: number;
    },
  ): Promise<any>;
  addCredits(id: number, amount?: number | string): Promise<any>;
  deleteUserWithHistory(id: number): Promise<any>;

  getPlans(): Promise<any[]>;
  updatePlan(
    id: number,
    data: { nume_plan?: string; pret_simulat?: number; credite_lunare?: number },
  ): Promise<any>;

  getAdminConversii(): Promise<any[]>;
  getAdminTranzactii(): Promise<any[]>;

  getUserDashboard(id: number): Promise<any>;
  upgradeUser(userId: number, id_abonament: number | undefined, crediteExtra: number): Promise<any>;
  generateAi(userId: number, tip_text: string, tema: string): Promise<any>;
}

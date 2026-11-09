class AdminModel {
  constructor(id_utilizator, email_utilizator, rol_utilizator, credite_disponibile, nume_plan, data_creare) {
    this.id_utilizator = id_utilizator;
    this.email_utilizator = email_utilizator;
    this.rol_utilizator = rol_utilizator;
    this.credite_disponibile = credite_disponibile;
    this.nume_plan = nume_plan;
    this.data_creare = data_creare;
  }
}

module.exports = AdminModel;
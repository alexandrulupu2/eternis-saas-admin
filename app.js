const express = require("express");
const path = require("path");
const AdminController = require("./src/controllers/AdminController");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta principala duce direct la Admin Dashboard
app.get("/", (req, res) => res.redirect("/admin"));

// Rute Admin MVC Complete
app.get("/admin", AdminController.dashboard);
app.get("/admin/user/add", AdminController.renderAddUser);
app.post("/admin/user/add", AdminController.storeUser);
app.get("/admin/user/edit/:id", AdminController.renderEditUser);
app.post("/admin/user/edit/:id", AdminController.updateUser);
app.post("/admin/user/add-credits/:id", AdminController.addCredits);
app.get("/admin/user/delete/:id", AdminController.destroyUser);

app.listen(PORT, () => {
  console.log(`Serverul Eternis ruleaza pe http://localhost:${PORT}`);
});
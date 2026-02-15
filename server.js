const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const FILE = "licencias.json";

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify([]));
}

app.post("/check", (req, res) => {

    const { licencia, ip, recurso } = req.body;

    const licencias = JSON.parse(fs.readFileSync(FILE));

    const valida = licencias.find(l =>
        l.codigo === licencia &&
        l.ip === ip &&
        l.recurso === recurso &&
        l.estado === "Activa"
    );

    if (valida) {
        return res.json({ status: "valid" });
    }

    res.json({ status: "invalid" });
});

app.post("/create", (req, res) => {

    const { codigo, ip, recurso } = req.body;

    const licencias = JSON.parse(fs.readFileSync(FILE));

    licencias.push({
        codigo,
        ip,
        recurso,
        estado: "Activa"
    });

    fs.writeFileSync(FILE, JSON.stringify(licencias, null, 2));

    res.json({ ok: true });
});

app.post("/toggle", (req, res) => {

    const { codigo } = req.body;
    const licencias = JSON.parse(fs.readFileSync(FILE));

    const lic = licencias.find(l => l.codigo === codigo);

    if (lic) {
        lic.estado = lic.estado === "Activa" ? "Inactiva" : "Activa";
        fs.writeFileSync(FILE, JSON.stringify(licencias, null, 2));
    }

    res.json({ ok: true });
});

app.listen(3000, () => console.log("Servidor iniciado"));

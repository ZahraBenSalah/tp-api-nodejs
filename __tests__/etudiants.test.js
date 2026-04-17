const mongoose = require("mongoose");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../app");
const Etudiant = require("../models/Etudiant");

let mongoServer;

jest.setTimeout(120000); // éviter timeout

// ==========================
// SETUP
// ==========================
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  await mongoose.connect(mongoServer.getUri());
});

afterEach(async () => {
  await Etudiant.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});
// ==========================
// TEST GET ID invalide
// ==========================
describe("GET /api/etudiants", () => {
  test("retourne 400 pour un ID mal formaté", async () => {
    const res = await request(app).get("/api/etudiants/pas-un-id-valide");
    expect(res.statusCode).toBe(400);
  });
});

// ==========================
// TEST POST
// ==========================
describe("POST /api/etudiants", () => {
  test("retourne 400 si moyenne négative", async () => {
    const res = await request(app).post("/api/etudiants").send({
      nom: "Dupont",
      prenom: "Alice",
      email: "test@test.com",
      filiere: "Informatique",
      annee: 2,
      moyenne: -5,
    });

    expect(res.statusCode).toBe(400);
  });
});

// ==========================
// TEST GET BY ID
// ==========================
describe("GET /api/etudiants/:id", () => {
  test("retourne étudiant", async () => {
    const etudiant = await Etudiant.create({
      nom: "Dupont",
      prenom: "Alice",
      email: "alice@test.com",
      filiere: "Informatique",
      annee: 2,
      moyenne: 15,
    });

    const res = await request(app).get(`/api/etudiants/${etudiant._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.nom).toBe("Dupont");
  });
});

// ==========================
// TEST UPDATE
// ==========================
describe("PUT /api/etudiants/:id", () => {
  test("update moyenne", async () => {
    const etudiant = await Etudiant.create({
      nom: "Dupont",
      prenom: "Alice",
      email: "alice@test.com",
      filiere: "Informatique",
      annee: 2,
      moyenne: 10,
    });

    const res = await request(app)
      .put(`/api/etudiants/${etudiant._id}`)
      .send({ moyenne: 18 });

    expect(res.statusCode).toBe(200);
    expect(res.body.moyenne).toBe(18);
  });
});

// ==========================
// TEST DELETE
// ==========================
describe("DELETE /api/etudiants/:id", () => {
  test("supprime étudiant", async () => {
    const etudiant = await Etudiant.create({
      nom: "Dupont",
      prenom: "Alice",
      email: "alice@test.com",
      filiere: "Informatique",
      annee: 2,
      moyenne: 15,
    });

    const res = await request(app).delete(`/api/etudiants/${etudiant._id}`);

    expect(res.statusCode).toBe(200);
  });
});

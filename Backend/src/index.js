const express = require("express");
const { Client } = require("@elastic/elasticsearch");
const cors = require("cors"); // Import de CORS
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// Configuration de CORS
app.use(
  cors({
    origin: "http://localhost:3002", // Autorise uniquement le frontend
    methods: ["GET", "POST", "DELETE"], // Autorise uniquement ces méthodes
  })
);

// Middleware pour analyser le JSON
app.use(express.json());

// Configuration de la connexion à Elasticsearch
const client = new Client({
  node: process.env.ELASTIC_URL || "http://localhost:9200",
});

// Endpoint de test pour vérifier la connexion à Elasticsearch
app.get("/", async (req, res) => {
  try {
    const info = await client.info();
    res.send({
      message: "Backend connecté à Elasticsearch !",
      elasticInfo: info,
    });
  } catch (error) {
    console.error("Erreur de connexion à Elasticsearch :", error);
    res.status(500).send({ message: "Erreur de connexion à Elasticsearch." });
  }
});

// Endpoint pour lister tous les produits
app.get("/products", async (req, res) => {
  try {
    const result = await client.search({
      index: "products",
      query: { match_all: {} },
    });

    const products = result.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    res.status(200).send(products);
  } catch (error) {
    console.error("Erreur lors de la récupération des produits :", error);
    res.status(500).send({ message: "Erreur lors de la récupération des produits." });
  }
});

// Endpoint pour ajouter un produit
app.post("/products", async (req, res) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || typeof price !== "number") {
      return res.status(400).send({
        message: "Les champs 'name', 'category', et 'price' sont obligatoires.",
      });
    }

    const result = await client.index({
      index: "products",
      document: {
        name,
        category,
        price,
        createdAt: new Date().toISOString(),
      },
    });

    res.status(201).send({
      message: "Produit ajouté avec succès !",
      productId: result._id,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout du produit :", error);
    res.status(500).send({ message: "Erreur lors de l'ajout du produit." });
  }
});

// Endpoint pour supprimer un produit par ID
app.delete("/products/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "L'ID du produit est requis." });
    }

    const result = await client.delete({
      index: "products",
      id,
    });

    res.status(200).send({
      message: "Produit supprimé avec succès !",
      result,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du produit :", error);

    if (error.meta && error.meta.statusCode === 404) {
      return res.status(404).send({ message: "Produit introuvable." });
    }

    res.status(500).send({ message: "Erreur lors de la suppression du produit." });
  }
});

// Endpoint pour rechercher des produits avec des filtres
app.get("/products/search", async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const query = {
      bool: {
        must: [],
        filter: [],
      },
    };

    if (name) {
      query.bool.must.push({
        match: { name },
      });
    }

    if (category) {
      query.bool.filter.push({
        term: { category },
      });
    }

    if (minPrice || maxPrice) {
      const range = {};
      if (minPrice) range.gte = parseFloat(minPrice);
      if (maxPrice) range.lte = parseFloat(maxPrice);

      query.bool.filter.push({
        range: { price: range },
      });
    }

    const result = await client.search({
      index: "products",
      query,
    });

    // Formater la réponse
    const products = result.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    res.status(200).send(products);
  } catch (error) {
    console.error("Erreur lors de la recherche des produits :", error);
    res.status(500).send({ message: "Erreur lors de la recherche des produits." });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

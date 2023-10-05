const express = require("express");
const notas = require("./database");

const routes = express();

let idNotas = notas.length + 1;

routes.get("/notas", (req, res) => {
  return res.json(notas);
});

routes.post("/notas", (req, res) => {
  const { nota } = req.body;

  if (!nota) {
    return res.status(400).json({
      mensagem: "Você precisa inserir o conteúdo da nota para criar nova nota!",
    });
  }

  const verificarRepeticao = notas.some((texto) => texto.nota === String(nota));

  if (verificarRepeticao) {
    return res
      .status(400)
      .json({ mensagem: "A nota que você está tentando inserir já existe!" });
  }

  notas.push({
    id: idNotas++,
    nota,
  });

  return res.status(204).send();
});

routes.put("/notas/:id", (req, res) => {
  const { id } = req.params;
  const { nova_nota } = req.body;

  const verificarId = notas.find((notaSistema) => {
    return notaSistema.id === Number(id);
  });

  if (!verificarId) {
    return res
      .status(404)
      .json({ mensagem: "Nota não encontrada no sistema!" });
  }

  if (!nova_nota) {
    return res
      .status(400)
      .json({ mensagem: "Você não pode atualizar uma nota sem conteúdo!" });
  }

  const verificarRepeticao = notas.some(
    (texto) => texto.nota === String(nova_nota)
  );

  if (verificarRepeticao) {
    return res
      .status(400)
      .json({ mensagem: "A nota que você está tentando inserir já existe!" });
  }

  verificarId.nota = nova_nota;
  res.status(204).send();
});

routes.delete("/notas/:id", (req, res) => {
  const { id } = req.params;

  const verificarId = notas.find((notaSistema) => {
    return notaSistema.id === Number(id);
  });

  if (!verificarId) {
    return res.status(404).json({
      mensagem:
        "Nota não encontrada no sistema! Digite um ID válido para continuar!",
    });
  }

  const indiceNota = notas.findIndex((notaSistema) => {
    return notaSistema.id === Number(id);
  });

  notas.splice(indiceNota, 1);
  return res.status(204).send();
});

module.exports = routes;

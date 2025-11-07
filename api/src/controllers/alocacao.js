const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const read = async (req, res) => {
    const alocacoes = await prisma.alocacao.findMany();
    res.json(alocacoes);
};

const readArea = async (req, res) => {
    const { area } = req.params;
    const alocacoes = await prisma.alocacao.findMany({
        where: { area: Number(area) },
        include: { possui: true, contem: true }
    });
    res.json(alocacoes);
};

module.exports = {
    read,
    readArea
};
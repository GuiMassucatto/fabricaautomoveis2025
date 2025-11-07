const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const read = async (req, res) => {
    try {
        const vendas = await prisma.venda.findMany();
        res.json(vendas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar vendas' });
    }
};

const create = async (req, res) => {
    try {
        const { clienteId, concessionariaId, modelo } = req.body;

        const automovel = await prisma.automovel.findFirst({
            where: { modelo: modelo }
        });

        if (!automovel) {
            return res.status(400).json({ error: 'Automóvel não encontrado' });
        }

        const alocacao = await prisma.alocacao.findFirst({
            where: {
                automovel: automovel.id,
                concessionaria: Number(concessionariaId)
            }
        });

        if (!alocacao) {
            return res.status(400).json({ error: 'Alocação não encontrada para esta concessionária e automóvel' });
        }

        const novaVenda = await prisma.venda.create({
            data: {
                cliente: Number(clienteId),
                alocacao: alocacao.id
            }
        });

        res.json(novaVenda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar venda' });
    }
};

module.exports = {
    read,
    create
};

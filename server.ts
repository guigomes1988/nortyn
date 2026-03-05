import express from 'express';
import { Client } from 'pg';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

async function initDb() {
    try {
        await client.connect();
        console.log('Conectado ao Neon DB com sucesso!');

        // Criar tabela de leads se não existir
        await client.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        company TEXT,
        role TEXT,
        industry TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('Tabela "leads" verificada/criada.');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

initDb();

app.post('/api/leads', async (req, res) => {
    const { fullName, email, company, role, industry } = req.body;

    if (!fullName || !email) {
        return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
    }

    try {
        const query = 'INSERT INTO leads (full_name, email, company, role, industry) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        const values = [fullName, email, company, role, industry];
        const result = await client.query(query, values);

        console.log('Novo lead salvo:', result.rows[0]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erro ao salvar lead:', err);
        res.status(500).json({ error: 'Erro interno ao salvar os dados.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

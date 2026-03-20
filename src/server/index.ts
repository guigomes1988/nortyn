import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'nortyn_super_secret_jwt_key';

app.use(cors());
app.use(express.json());

const sql = neon(process.env.DATABASE_URL!);

// Initialize database
async function initDB() {
  try {
    // Leads table
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        company TEXT,
        role TEXT,
        revenue TEXT,
        sector TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Site Content table
    await sql`
      CREATE TABLE IF NOT EXISTS site_content (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Testimonials table
    await sql`
      CREATE TABLE IF NOT EXISTS testimonials (
        id SERIAL PRIMARY KEY,
        client_name TEXT NOT NULL,
        company_role TEXT NOT NULL,
        content TEXT NOT NULL,
        avatar_url TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Users table for Admin
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed default admin user
    const existingUsers = await sql`SELECT id FROM users LIMIT 1`;
    if (existingUsers.length === 0) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('Alvinh02704@', salt);
      await sql`
        INSERT INTO users (name, email, password_hash)
        VALUES ('Admin', 'guigomespubli@gmail.com', ${hash})
      `;
      console.log('Default admin user created.');
    }

    // Seed default testimonials if empty
    const existingTestimonials = await sql`SELECT id FROM testimonials LIMIT 1`;
    if (existingTestimonials.length === 0) {
      await sql`
        INSERT INTO testimonials (client_name, company_role, content, avatar_url) VALUES 
        ('Sulist', 'Diretor Comercial', 'A Nortyn trouxe a previsibilidade que precisávamos em vendas. Conseguimos estruturar nossa equipe e alcançar as metas com clareza.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'),
        ('Datatec', 'Gerente de Vendas', 'Com a Nortyn, ganhamos agilidade e controle. A equipe pode se concentrar no que realmente importa: vender mais.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'),
        ('Topa Info', 'CEO e Fundador', 'A melhor decisão que tomamos para nossa operação. A visibilidade dos dados nos deu confiança para escalar.', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100'),
        ('Victória Logística', 'Coordenador Comercial', 'Nunca foi tão fácil acompanhar o desempenho de cada representante. A operação ficou muito mais rápida.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100')
      `;
      console.log('Default testimonials seeded.');
    }

    // Social Links table
    await sql`
      CREATE TABLE IF NOT EXISTS social_links (
        id SERIAL PRIMARY KEY,
        platform TEXT UNIQUE NOT NULL,
        url TEXT NOT NULL,
        is_active BOOLEAN DEFAULT true,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed default social links if empty
    const existingSocials = await sql`SELECT id FROM social_links LIMIT 1`;
    if (existingSocials.length === 0) {
      await sql`
        INSERT INTO social_links (platform, url, is_active) VALUES 
        ('facebook', 'https://facebook.com', false),
        ('instagram', 'https://instagram.com/nortyn', true),
        ('linkedin', 'https://linkedin.com/company/nortyn', true),
        ('youtube', 'https://youtube.com', false),
        ('tiktok', 'https://tiktok.com', false)
      `;
      console.log('Default social links seeded.');
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

initDB();

// Authentication Middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req: any, res: any) => {
  try {
    const users = await sql`SELECT id, name, email FROM users WHERE id = ${req.user.id}`;
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(users[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/auth/user', authenticateToken, async (req: any, res: any) => {
  const { name, email, password } = req.body;
  try {
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      await sql`
        UPDATE users 
        SET name = ${name}, email = ${email}, password_hash = ${hash}
        WHERE id = ${req.user.id}
      `;
    } else {
      await sql`
        UPDATE users 
        SET name = ${name}, email = ${email}
        WHERE id = ${req.user.id}
      `;
    }
    const updatedUser = await sql`SELECT id, name, email FROM users WHERE id = ${req.user.id}`;
    res.json(updatedUser[0]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- TESTIMONIALS ENDPOINTS ---
app.get('/api/testimonials', async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM testimonials ORDER BY id ASC`;
    res.json(rows);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/testimonials', authenticateToken, async (req, res) => {
  const { client_name, company_role, content, avatar_url } = req.body;

  if (!client_name || !company_role || !content || !avatar_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await sql`
      INSERT INTO testimonials (client_name, company_role, content, avatar_url)
      VALUES (${client_name}, ${company_role}, ${content}, ${avatar_url})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/testimonials/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { client_name, company_role, content, avatar_url } = req.body;

  if (!client_name || !company_role || !content || !avatar_url) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await sql`
      UPDATE testimonials 
      SET client_name = ${client_name}, company_role = ${company_role}, content = ${content}, avatar_url = ${avatar_url}
      WHERE id = ${id}
      RETURNING *
    `;
    if (result.length === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json(result[0]);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/testimonials/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING *`;
    if (result.length === 0) return res.status(404).json({ error: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- LEADS ENDPOINT ---
app.post('/api/leads', async (req, res) => {
  const { name, email, phone, company, role, revenue, sector } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await sql`
      INSERT INTO leads (name, email, phone, company, role, revenue, sector)
      VALUES (${name}, ${email}, ${phone}, ${company}, ${role}, ${revenue}, ${sector})
      RETURNING *
    `;
    res.status(201).json({ message: 'Lead captured successfully', data: result[0] });
  } catch (error) {
    console.error('Error inserting lead:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- CONTENT ENDPOINTS ---
app.get('/api/content', async (req, res) => {
  try {
    const rows = await sql`SELECT key, value FROM site_content`;
    const content = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/content/upsert', authenticateToken, async (req: any, res: any) => {
  const { content } = req.body;

  if (!content || typeof content !== 'object') {
    return res.status(400).json({ error: 'Invalid content format' });
  }

  try {
    for (const [key, value] of Object.entries(content)) {
      await sql`
        INSERT INTO site_content (key, value, updated_at)
        VALUES (${key}, ${value as string}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = EXCLUDED.updated_at
      `;
    }
    res.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error upserting content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Social Links API ---

// Get all social links (Public)
app.get('/api/social-links', async (req, res) => {
  try {
    const links = await sql`SELECT * FROM social_links ORDER BY id ASC`;
    res.json(links);
  } catch (error) {
    console.error('Error fetching social links:', error);
    res.status(500).json({ error: 'Failed to fetch social links' });
  }
});

// Update social link (Protected)
app.put('/api/social-links/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { url, is_active } = req.body;

  try {
    const result = await sql`
      UPDATE social_links 
      SET url = ${url}, is_active = ${is_active}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Social link not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error updating social link:', error);
    res.status(500).json({ error: 'Failed to update social link' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only images (jpg, png, webp) are allowed'));
  }
});
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'nortyn_super_secret_jwt_key';

app.use(cors());
app.use(express.json());

// Vercel serverless functions strip the /api prefix from the URL.
// We prepend it back so that Express routes match correctly.
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  next();
});

const databaseUrl = process.env.DATABASE_URL || '';
const sql = databaseUrl ? neon(databaseUrl) : null as any;

// Initialize database
async function initDB() {
  if (!sql) {
    console.error("DATABASE_URL is not set. Database not initialized.");
    return;
  }
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

    // Gallery table
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        url TEXT NOT NULL,
        alt TEXT,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed default gallery images if empty
    const existingGallery = await sql`SELECT id FROM gallery_images LIMIT 1`;
    if (existingGallery.length === 0) {
      const defaultImages = [
        ['/telas-desktop/01.jpeg', 'Interface Desktop 1'],
        ['/telas-desktop/02.jpeg', 'Interface Desktop 2'],
        ['/telas-desktop/03.jpeg', 'Interface Desktop 3'],
        ['/telas-desktop/04.jpeg', 'Interface Desktop 4'],
        ['/telas-desktop/05.jpeg', 'Interface Desktop 5'],
        ['/telas-desktop/06.jpeg', 'Interface Desktop 6'],
        ['/telas-desktop/07.jpeg', 'Interface Desktop 7'],
        ['/telas-desktop/08.jpeg', 'Interface Desktop 8'],
        ['/telas-desktop/09.jpeg', 'Interface Desktop 9']
      ];
      
      for (const [url, alt] of defaultImages) {
        await sql`
          INSERT INTO gallery_images (url, alt, display_order)
          VALUES (${url}, ${alt}, 0)
        `;
      }
      console.log('Default gallery images seeded.');
    }

    // App Settings table
    await sql`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed default settings if empty
    const existingSettings = await sql`SELECT key FROM app_settings LIMIT 1`;
    if (existingSettings.length === 0) {
      await sql`
        INSERT INTO app_settings (key, value) VALUES 
        ('webhook_url', 'https://webhook.hvjtech.com.br/webhook/tfaa_iniciaConversa'),
        ('head_scripts', ''),
        ('body_scripts', '')
      `;
      console.log('Default settings seeded.');
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
    if (!sql) throw new Error("DATABASE_URL não configurada no ambiente da Vercel!");
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Server error' });
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
    if (!sql) throw new Error("A variável de ambiente DATABASE_URL não está configurada na Vercel!");
    const rows = await sql`SELECT * FROM testimonials ORDER BY id ASC`;
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
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

app.post('/api/testimonials/upload', authenticateToken, upload.single('image'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
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

// --- GALLERY ENDPOINTS ---
app.get('/api/gallery', async (req, res) => {
  try {
    const images = await sql`SELECT * FROM gallery_images ORDER BY display_order ASC, id DESC`;
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
});

app.post('/api/gallery', authenticateToken, async (req, res) => {
  const { url, alt, display_order } = req.body;
  try {
    const result = await sql`
      INSERT INTO gallery_images (url, alt, display_order)
      VALUES (${url}, ${alt || ''}, ${display_order || 0})
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add image' });
  }
});

app.post('/api/gallery/upload', authenticateToken, upload.single('image'), async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  const alt = req.body.alt || '';

  try {
    const result = await sql`
      INSERT INTO gallery_images (url, alt, display_order)
      VALUES (${imageUrl}, ${alt}, 0)
      RETURNING *
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Database error after upload:', error);
    res.status(500).json({ error: 'Failed to save image reference' });
  }
});

app.delete('/api/gallery/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM gallery_images WHERE id = ${id}`;
    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// --- SETTINGS ENDPOINTS ---
app.get('/api/settings', async (req, res) => {
  try {
    const rows = await sql`SELECT key, value FROM app_settings`;
    const settings = rows.reduce((acc, row) => {
      acc[row.key] = row.value;
      return acc;
    }, {} as Record<string, string>);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

app.post('/api/settings', authenticateToken, async (req, res) => {
  const { settings } = req.body;
  try {
    for (const [key, value] of Object.entries(settings)) {
      await sql`
        INSERT INTO app_settings (key, value, updated_at)
        VALUES (${key}, ${value as string}, CURRENT_TIMESTAMP)
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = EXCLUDED.updated_at
      `;
    }
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// --- USER MANAGEMENT ENDPOINTS ---
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await sql`SELECT id, name, email, created_at FROM users ORDER BY id ASC`;
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/users', authenticateToken, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const result = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${hash})
      RETURNING id, name, email, created_at
    `;
    res.status(201).json(result[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.delete('/api/users/:id', authenticateToken, async (req: any, res: any) => {
  const { id } = req.params;
  // Prevent deleting self
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete yourself' });
  }
  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;

# MicDrop Setup Guide

## Prerequisites
- Node.js 18+ installed
- A Neon account (free tier available)
- A Vercel account (for Blob storage)

## 1. Neon Database Setup

1. **Create a Neon Account**
   - Go to [https://console.neon.tech](https://console.neon.tech)
   - Sign up for a free account

2. **Create a New Project**
   - Click "Create a project"
   - Choose your region (select closest to your users)
   - Note your connection strings

3. **Get Your Connection String**
   - In the Neon console, go to your project dashboard
   - Click on "Connection Details"
   - Copy the connection string (it looks like: `postgresql://user:pass@host/dbname`)

4. **Update .env.local**
   ```env
   DATABASE_URL="your-neon-pooled-connection-string"
   DIRECT_URL="your-neon-direct-connection-string"
   ```

5. **Run Database Migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## 2. Vercel Blob Storage Setup

1. **Create a Vercel Account**
   - Go to [https://vercel.com](https://vercel.com)
   - Sign up and create a team/project

2. **Enable Blob Storage**
   - Go to your Vercel dashboard
   - Navigate to "Storage" → "Create Database"
   - Select "Blob" and create a new store
   - Name it (e.g., "micdrop-images")

3. **Get Your Token**
   - In the Blob store settings, find "API Tokens"
   - Create a new token with read/write access
   - Copy the token

4. **Update .env.local**
   ```env
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxx"
   ```

## 3. OpenAI API Setup (Optional)

1. **Get an API Key**
   - Go to [https://platform.openai.com](https://platform.openai.com)
   - Create an account and add credits
   - Generate an API key

2. **Update .env.local**
   ```env
   OPENAI_API_KEY="sk-xxxxxxxxxx"
   ```

## 4. Running the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Database Migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Homepage: http://localhost:3000
   - Login: http://localhost:3000/login
   - Dashboard: http://localhost:3000/dashboard

## 5. Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Setup Neon and Vercel Blob"
   git push
   ```

2. **Import to Vercel**
   - Go to [https://vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Add environment variables from .env.local
   - Deploy!

## Environment Variables Checklist

Make sure all these are set in your .env.local and Vercel dashboard:

- [ ] `DATABASE_URL` - Neon pooled connection string
- [ ] `DIRECT_URL` - Neon direct connection string  
- [ ] `BLOB_READ_WRITE_TOKEN` - Vercel Blob token
- [ ] `OPENAI_API_KEY` - OpenAI API key (optional)
- [ ] `NEXTAUTH_SECRET` - Random secret for auth
- [ ] `NEXTAUTH_URL` - Your app URL

## Troubleshooting

### Database Connection Issues
- Ensure your IP is whitelisted in Neon (if using IP restrictions)
- Check that SSL mode is set to `require` in the connection string
- Verify the database exists and migrations have run

### Blob Storage Issues
- Ensure your token has read/write permissions
- Check that you're within your storage limits
- Verify the token is correctly formatted in .env.local

### Build/Deploy Issues
- Clear .next folder and node_modules, then reinstall
- Ensure all environment variables are set in Vercel
- Check Vercel function logs for errors

## Support

For issues or questions:
- Neon docs: https://neon.tech/docs
- Vercel docs: https://vercel.com/docs/storage/vercel-blob
- Create an issue: https://github.com/ncheyer/MicDrop/issues
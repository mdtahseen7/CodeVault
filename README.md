# CodeVault - University Practical Manager

A high-end "Bento" style application for managing university practicals, built with Next.js 14/15, Prisma, and Tailwind CSS.

## Features

- **Dashboard**: Bento-grid layout with real-time search and filtering.
- **Practical Editor**: Monaco Editor integration for code viewing and editing.
- **PDF Generation**: Download practicals as PDF with code and output.
- **Dark Mode**: Cyberpunk/Academic theme.
- **Server Actions**: Full-stack logic without external API.

## Setup

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Setup**:
    - Create a PostgreSQL database (e.g., on Neon DB).
    - Create a `.env` file in the root directory:
      ```env
      DATABASE_URL="postgres://user:password@host:port/database"
      ```

3.  **Initialize Database**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Seed Data** (Optional but recommended):
    ```bash
    npx tsx prisma/seed.ts
    ```

5.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: UI components (Shadcn-like) and feature components.
- `actions/`: Server Actions for backend logic.
- `prisma/`: Database schema and seed script.
- `lib/`: Utility functions.

## Technologies

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma v6
- Monaco Editor
- jsPDF & html2canvas

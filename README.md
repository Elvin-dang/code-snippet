# 🧩 Code Snippet

A modern web platform for developers to **share, discover, and analyze code snippets** with automatic **time complexity detection**, **language-based tagging**, and **user profiles** — built with **Next.js 15** and **Tailwindcss**.

---

## 🚀 Features

- 🧠 **Time Complexity Analysis** for algorithms
- 🏷️ **Smart Tagging & Language Categorization**
- 👤 **User Authentication & Profiles** (NextAuth)
- 💾 **PostgreSQL Database (via Prisma ORM)**
- 🌐 **Multilingual Support** (English & Vietnamese)

---

## 🛠️ Tech Stack

| Layer                           | Technology                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------- |
| **Framework**                   | [Next.js 15](https://nextjs.org/) (App Router)                                |
| **Database**                    | [PostgreSQL](https://www.postgresql.org/)                                     |
| **ORM**                         | [Prisma](https://www.prisma.io/)                                              |
| **Auth**                        | [NextAuth.js](https://next-auth.js.org/) + [Appwrite](https://appwrite.io/)   |
| **UI**                          | [Tailwind CSS 4](https://tailwindcss.com/) + [Shacdn](https://ui.shadcn.com/) |
| **Icons**                       | [Lucide React](https://lucide.dev/)                                           |
| **Forms**                       | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)     |
| **Notifications**               | [Sonner](https://sonner.emilkowal.ski/)                                       |
| **Internationalization (i18n)** | Custom dictionary system (EN/VI)                                              |

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Elvin-dang/code-snippet.git
cd code-snippet
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure Environment Variables

Copy the example environment file and update it:

```bash
cp .env.example .env
```

Edit `.env` and replace placeholder values with your own credentials:

```bash
# 🌐 Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# 🔐 NextAuth Configuration
NEXTAUTH_SECRET="your-secret-key"

# 🗄️ Database (PostgreSQL / Neon)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# 🧩 Appwrite Configuration
NEXT_PUBLIC_APPWRITE_PROJECT_ID="your-appwrite-project-id"
NEXT_PUBLIC_APPWRITE_PROJECT_NAME="code snippet"
NEXT_PUBLIC_APPWRITE_ENDPOINT="https://your-appwrite-endpoint.io/v1"
```

---

### 4. Initialize the Database

Generate Prisma client and apply migrations:

```bash
npx prisma migrate dev --name init
```

If you’re setting up the database for the first time, seed initial data:

```bash
npx prisma db seed
```

---

### 5. Run the Development Server

```bash
npm run dev
```

Then open your app in the browser:

```
http://localhost:3000
```

---

## 🧰 Key Packages

### **Dependencies**

- `next`, `react`, `react-dom`
- `prisma`, `@prisma/client`
- `next-auth`, `appwrite`
- `tailwindcss`, `radix-ui`, `lucide-react`
- `react-hook-form`, `zod`
- `sonner`, `clsx`, `nanoid`

### **Dev Dependencies**

- `typescript`, `tsx`
- `eslint`, `eslint-config-next`
- `@tailwindcss/postcss`
- `@types/react`, `@types/node`

---

## ❤️ Credits

Built with 💻 by Vinh

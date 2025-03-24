# Starter Kit Backend dengan Node.js dan Express.js

Selamat datang di project Starter Kit Backend! Ini adalah setup awal yang bisa Anda gunakan untuk membangun aplikasi backend menggunakan Node.js dan Express.js. Berikut adalah langkah-langkah untuk memulai.

## Prasyarat

Sebelum memulai, pastikan Anda memiliki perangkat lunak berikut terinstal:

- [Node.js](https://nodejs.org/) versi 20 atau lebih tinggi
- [Git](https://git-scm.com/)

## Cara Memulai

Ikuti langkah-langkah di bawah ini untuk memulai menggunakan project ini:

### 1. Clone repository ini

Clone repository ke dalam folder lokal Anda:

```bash
git clone https://github.com/romirahmann/staterkit-backend-nodejs.git
cd repository-name
```

### 2. Install Dependencies

Instal semua dependencies yang diperlukan dengan menjalankan perintah berikut:

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env` di direktori root proyek Anda, dan tambahkan variabel-variabel berikut (sesuaikan dengan kebutuhan Anda):

```env
DB_HOST = your-database-host
DB_PORT = your-database-port
DB_USER = your-database-user
DB_PASSWORD = your-database-password
DB_DATABASE = your-database-name

DEV = FALSE
SECRET_KEY = your-secret-key
PORT = your-port
```

### 4. Jalankan Aplikasi

Setelah instalasi selesai dan konfigurasi `.env` sudah dilakukan, Anda dapat menjalankan aplikasi dengan perintah berikut:

```bash
npm start
```

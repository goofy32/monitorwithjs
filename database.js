// Import modul mssql
const sql = require('mssql');

// Konfigurasi koneksi ke database MSSQL
const config = {
  user: 'admin',         // Nama pengguna MSSQL
  password: 'Aril2003.',         // Kata sandi MSSQL (biarkan kosong jika tidak ada)
  server: 'monitorsuhu.c9yk444cw9fo.ap-southeast-2.rds.amazonaws.com',  // Server MSSQL, biasanya 'localhost' atau IP server
  database: 'monitorsuhu', // Nama database yang digunakan
};

// Coba membuat koneksi
sql.connect(config).then(pool => {
  console.log('Connected to MSSQL database');
  return pool;
}).catch(err => {
  console.error('Error connecting to MSSQL database:', err);
});

// Export koneksi agar dapat digunakan di file lain
module.exports = sql;
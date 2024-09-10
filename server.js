// Import modul yang diperlukan
const express = require('express');
const { sql, poolPromise } = require('./database'); // Import koneksi dari database.js

// Buat aplikasi Express
const app = express();
const path = require('path');

// Menentukan direktori tempat file HTML berada
const publicDirectoryPath = path.join(__dirname, 'public');
app.use(express.static(publicDirectoryPath));

// Endpoint untuk menampilkan tampilan HTML
app.get('/', (req, res) => {
  // Mengirimkan file HTML sebagai respons
  res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

// Endpoint untuk mengambil data dari database
app.get('/data', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT TOP 1 * FROM data ORDER BY id DESC');
    
    // Mengirim data terbaru sebagai respons
    res.json(result.recordset);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send(error);
  }
});

// Endpoint untuk menambahkan data baru ke database
app.get('/add-data', async (req, res) => {
  try {
    const newData = {
      kelembapan: req.query.kelembapan,
      suhu_ruang: req.query.suhu_ruang,
      suhu_air: req.query.suhu_air,
      ph_air: req.query.ph_air,
      time: req.query.time
    };

    const pool = await poolPromise;
    const query = `
      INSERT INTO data (kelembapan, suhu_ruang, suhu_air, ph_air, time)
      VALUES (@kelembapan, @suhu_ruang, @suhu_air, @ph_air, @time)
    `;

    await pool.request()
      .input('kelembapan', sql.Float, newData.kelembapan)
      .input('suhu_ruang', sql.Float, newData.suhu_ruang)
      .input('suhu_air', sql.Float, newData.suhu_air)
      .input('ph_air', sql.Float, newData.ph_air)
      .input('time', sql.VarChar, newData.time)
      .query(query);

    // Berhasil menambahkan data
    res.status(200).send('Data added successfully');
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

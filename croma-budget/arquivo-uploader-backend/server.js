const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do multer para gerenciar o local de armazenagem dos arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nome do arquivo
  },
});

const upload = multer({ storage });

// Certifique-se de que a pasta 'uploads' existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Rota para upload de arquivo
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Retornar o link do arquivo
  const fileUrl = `http://localhost:${PORT}/files/${req.file.filename}`;
  res.send({ fileUrl });
});

// Rota para servir arquivos estáticos
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// Endpoint de teste
app.get('/', (req, res) => {
  res.send('Arquivo Uploader API');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
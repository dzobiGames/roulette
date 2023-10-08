import express from 'express';
import routes from './routes/main';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8098;

app.use(express.json());
app.use(cors());
app.use('/api', routes); // Montez les routes sous '/api'

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});

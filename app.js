console.clear();
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import 'dotenv/config';
import Database from './database/config.js';
import userRouter from './routers/userRouter.js';
import sectionRouter from './routers/sectionRouter.js';
import classRouter from './routers/classRouter.js';
import sql_executor from './pages/sql-stmt.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4001;
const commonPath = '/api/v1';
const appendEndpoint = (endpoint) => { return (commonPath + endpoint); };

sql_executor.createUserTable();
sql_executor.createSectionTable();
sql_executor.createClassTable();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(appendEndpoint('/users'), userRouter);
app.use(appendEndpoint('/sections'), sectionRouter);
app.use(appendEndpoint('/class'), classRouter);

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'pages', 'index.html')); });

app.listen(PORT, '0.0.0.0', () => { console.log(`http://10.73.0.186:${PORT}`); });
import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

let tarefas = [
    { id: 1, titulo: "Aprender Express.js", concluida: true },
    { id: 2, titulo: "Criar rotas GET e POST", concluida: false },
    { id: 3, titulo: "Testar a API com REST Client", concluida: false }
];

const middlewareAutenticacao = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (authHeader === 'chave-secreta') {
        next();
    } else {
        res.status(401).json({ erro: "Não autorizado. Token ausente ou inválido." });
    }
};

const middlewareValidacaoCorpo = (req, res, next) => {
    const { titulo } = req.body;
    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({ erro: "O campo 'titulo' é obrigatório e deve ser um texto válido." });
    }
    next();
};

const middlewareLogAcao = (req, res, next) => {
    console.log(`[LOG] [${new Date().toISOString()}] Tentativa de criação: "${req.body.titulo}"`);
    next();
};

app.get('/', (req, res) => {
    res.send("API de Tarefas no ar");
});

app.get('/tarefas', (req, res) => {
    const { concluida } = req.query;

    if (concluida !== undefined) {
        const statusFiltrado = concluida === 'true';
        const tarefasFiltradas = tarefas.filter(t => t.concluida === statusFiltrado);
        return res.json(tarefasFiltradas);
    }

    res.json(tarefas);
});

app.get('/tarefas/:id', (req, res) => {
    const idParam = parseInt(req.params.id);
    const tarefaEncontrada = tarefas.find(t => t.id === idParam);

    if (!tarefaEncontrada) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(tarefaEncontrada);
});

app.post('/tarefas', [
    middlewareAutenticacao, 
    middlewareValidacaoCorpo, 
    middlewareLogAcao
], (req, res) => {
    const { titulo } = req.body;

    const novaTarefa = {
        id: tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1,
        titulo: titulo,
        concluida: false
    };

    tarefas.push(novaTarefa);
    res.status(201).json(novaTarefa);
});

app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso em http://localhost:${PORT}`);
});
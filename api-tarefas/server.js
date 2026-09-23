import express from 'express';

const app = express();
const PORT = 3000;

// Configuração do middleware para ler JSON no corpo (body) das requisições (Item 5)
app.use(express.json());

// Array fixo em memória inicializado com 3 tarefas (Item 2)
let tarefas = [
    { id: 1, titulo: "Aprender Express.js", concluida: true },
    { id: 2, titulo: "Criar rotas GET e POST", concluida: false },
    { id: 3, titulo: "Testar a API com REST Client", concluida: false }
];

// 1) 
app.get('/', (req, res) => {
    res.send("API de Tarefas no ar");
});

// 2) e 4) 
app.get('/tarefas', (req, res) => {
    const { concluida } = req.query;

    if (concluida !== undefined) {
        const statusFiltrado = concluida === 'true';
        const tarefasFiltradas = tarefas.filter(t => t.concluida === statusFiltrado);
        return res.json(tarefasFiltradas);
    }

    // Retorna todas as tarefas caso não passe query string
    res.json(tarefas);
});

// 3)
app.get('/tarefas/:id', (req, res) => {
    const idParam = parseInt(req.params.id);
    const tarefaEncontrada = tarefas.find(t => t.id === idParam);

    if (!tarefaEncontrada) {
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.json(tarefaEncontrada);
});

// 5) 
app.post('/tarefas', (req, res) => {
    const { titulo } = req.body;

    if (!titulo) {
        return res.status(400).json({ erro: "O campo 'titulo' é obrigatório." });
    }

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
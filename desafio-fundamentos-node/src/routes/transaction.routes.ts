import { Router } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();

// Rota de get ... pegar o repositório do banco

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();

    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

// Rota de envio ao banco de nova rota criada

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    // Regras de negócio da criação do repositório. Foi separado para o arquivo da pasta services

    const CreateTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const transaction = CreateTransaction.execute({ title, value, type });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;

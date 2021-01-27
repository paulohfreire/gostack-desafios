import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    // Não permitir uma retirada de valor (outcome) sem saldo suficiente (balance)
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError('Value for outcome is bigger than total value');
    }

    // pesquisar se a categoria já existe no repositório utilizando a função findOne
    let transactionCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    // se a categoria não existe criar uma nova
    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(transactionCategory);
    }
    // criar nova categoria no repositório com as informações de title...
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    // salvar a categoria criada em transaction
    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

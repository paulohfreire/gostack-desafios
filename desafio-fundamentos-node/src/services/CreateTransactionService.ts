import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    // para somente aceitar type income ou outcome e nada mais
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type is invalid');
    }
    if (type === 'outcome') {
      const { total } = this.transactionsRepository.getBalance();

      if (value > total) {
        throw Error('Value for outcome is bigger than total value');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      type,
      value,
    });

    return transaction;
  }
}

export default CreateTransactionService;

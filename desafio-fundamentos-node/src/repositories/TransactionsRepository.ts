import Transaction from '../models/Transaction';

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  // para salvar na memória

  constructor() {
    this.transactions = [];
  }

  // all só precisa retornar todas as transactions, por isso basta dar um return do this.transactions
  public all(): Transaction[] {
    return this.transactions;
  }

  // Criar a rotas de recebimento de transactions - income: Adicionar valor da transação ao saldo de income - entradas; 
  // e outcome: retirada de valor
  // Retornar o saldo das transações, que é o balance = income (total de entradas) - outcome (total de saídas)
  public getBalance(): Balance {
    const income = this.transactions.reduce((incomeIncrement, transaction) => {
      if (transaction.type === 'income') {
        return incomeIncrement + transaction.value;
      }

      return incomeIncrement + 0;
    }, 0);

    const outcome = this.transactions.reduce(
      (outcomeIncrement, transaction) => {
        if (transaction.type === 'outcome') {
          return outcomeIncrement + transaction.value;
        }

        return outcomeIncrement + 0;
      },
      0,
    );

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  // Criar a rota. Tipar os métodos
  // Utilizar a model

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    // salvando a transação no private transactions: Transaction[];

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;

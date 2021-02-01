const Account = require('../models/Account');

module.exports = {
  async deposit(req, res) {
    try {
      const { conta, valor } = req.body;

      // Verifica se a conta é diferente de null
      if (!conta) {
        return res.status(400).json('Account not found');
      }

      // Verifica se a conta existe no banco
      const isAccount = await Account.findOne({ conta: conta });
      if (!isAccount) {
        return res.status(400).json('Account not found');
      }

      // Incrementa o valor na conta
      await isAccount.updateOne({ $inc: { balance: valor } });
      return res.json(isAccount);
    } catch (error) {
      return res.status(400).json('Deposit failed: ' + error);
    }
  },

  async withdraw(req, res) {
    try {
      const { conta, valor } = req.body;

      // Verifica se a conta é diferente de null
      if (!conta) {
        return res.status(400).json('Account not found');
      }

      // Verifica se a conta existe no banco
      const isAccount = await Account.findOne({ conta: conta });
      if (!isAccount) {
        return res.status(400).json('Account not found');
      }

      let { balance } = isAccount;

      // Verifica se o valor do saque é maior do que o saldo
      if (valor > balance) {
        return res.status(400).json('Insufficient founds');
      }

      // Retira o valor da conta e +1 da taxa de transferência
      newBalance = balance - valor - 1;

      await isAccount.updateOne({ balance: newBalance });
      return res.status(200).json(isAccount);
    } catch (error) {
      return res.status(400).json('Withdraw failed: ' + error);
    }
  },

  async getBalance(req, res) {
    try {
      const { conta } = req.body;

      //Verifica se a conta é diferente de null
      if (!conta) {
        return res.status(400).json('Account not found');
      }

      //Verifica se a conta existe no banco
      const isAccount = await Account.findOne({ conta: conta });
      if (!isAccount) {
        return res.status(400).json('Account not found');
      }

      const { balance } = isAccount;

      res.status(200).json(balance);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy(req, res) {
    try {
      const { conta, agencia } = req.body;

      // Verifica se conta e agencia é diferente de null
      if (!conta || !agencia) {
        return res.status(400).json('Account or agency not found');
      }

      // Verifica se a conta existe no banco de dados
      const isAccount = await Account.findOne({ conta: conta });
      if (!isAccount) {
        return res.status(400).json('Account not found');
      }

      // Verifica se a agencia existe no banco de dados
      const isAgencia = await Account.findOne({ agencia: agencia });
      if (!isAgencia) {
        return res.status(400).json('Agency not found');
      }

      // Deleta uma conta e busca todas as agencias com os mesmos números
      const account = await Account.findOneAndDelete({ conta });
      const AllAgencia = await Account.find({ agencia });

      return res.json({ account, AllAgencia });
    } catch (error) {
      return res.json(error);
    }
  },
  async transfer(req, res) {
    try {
      const { origem, destino, valor } = req.body;

      // verifica se origem, destino e valor são diferentes de null
      if (!origem || !destino || !valor) {
        return res.status(400).json('Both accounts and value are necessary');
      }

      // Verifica se origem e destino existem no banco
      let origemAccount = await Account.findOne({ conta: origem });
      let destinoAccount = await Account.findOne({ conta: destino });

      let { agencia: origemAgencia, balance: origemBalance } = origemAccount;
      let { agencia: destinoAgencia, balance: destinoBalance } = destinoAccount;

      let sameAgency = true;

      // Verifica se as agências são iguais
      if (origemAgencia !== destinoAgencia) {
        sameAgency = false;
      }

      // Verifica se o valor da transferência é maior do que o saldo
      if (valor > origemBalance) {
        res.status(400).json('Insufficient founds');
      }

      // Se a agência for diferente adiciona uma taxa de 8
      if (!sameAgency) {
        origemBalance = origemBalance - valor - 8;
        destinoBalance = destinoBalance + valor;

        // Atualiza os valores da transferência
        await origemAccount.updateOne({ balance: origemBalance });
        await destinoAccount.updateOne({ balance: destinoBalance });
      } else {
        origemBalance = origemBalance - valor;
        destinoBalance = destinoBalance + valor;

        // Atualiza os valores da transferência
        await origemAccount.updateOne({
          balance: origemBalance,
        });
        await destinoAccount.updateOne({
          balance: destinoBalance,
        });
      }

      res.status(200).json({ origemAccount, destinoAccount });
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};

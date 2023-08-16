const cron = require('node-cron');
const { Wallet, SiteWallet, BankMethod, User, Transaction, Notification } = require('../models');
const walletUpdateService = require('./siteWallet.service');
const { asyncForEach } = require('../utils/asyncForEach');

let isCronRunning = false;

cron.schedule('0 0 1 * *', () => {
  createWithrawlTransactions();
});

const createWithrawlTransactions = async () => {
  try {
    isCronRunning = true;
    const users = await User.find({ isAuthor: true, status: 'active' });
    const usersMapped = users.map((user) => user._id);
    console.log('users===', usersMapped);
    const wallets = await Wallet.find({ user: { $in: usersMapped } });
    console.log('wallets===', wallets);
    asyncForEach(wallets, async (wallet, index) => {
      const pendingAmount = wallet.totalEarnings - wallet.totalWithdrawn;
      const user = await User.findOne({ _id: wallet.user });
      if (!user.defaultBankAccount) {
        console.log('sended notification for user to set default bank account');
        await Notification.create({
          user: user._id,
          title: 'Update Your Bank Account details',
          reason: 'Please setup your default primary bank Account!',
        });
      } else {
        wallet = await Wallet.findOne({ _id: wallet });
        wallet.totalWithdrawn = wallet.totalWithdrawn + pendingAmount;
        wallet.currentEarnings = 0;
        const transactionBody = {
          transactionType: 'withdrawn',
          user: wallet.user,
          instructor: true,
          amount: pendingAmount,
          status: 'pending',
          bankMethod: user.defaultBankAccount,
          admin: true,
        };
        const transaction = await Transaction.create(transactionBody);
        console.log('done!====', transaction);
        await Promise.all([wallet.save(), walletUpdateService.updateTotalWidthdrawnWallet(pendingAmount)]);
        console.log('transaction created!!!');
        if (index === wallets.length - 1) {
          isCronRunning = false;
        }
      }
    });
    const dt = await walletUpdateService.resetCurrent();
  } catch (err) {
    console.log('error in cron===');
    console.log(err);
  }
};

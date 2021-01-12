import { combineReducers } from 'redux';
import authReducer from '../../screens/Auth/reducer/authReducer';
import homeReducer from '../../screens/Home/reducer/homeReducer';
import accountReducer from '../../screens/Account/reducer/accountReducer';
import transactionReducer from '../../screens/Transactions/reducer/transactionReducer';
import loanReducer from '../../screens/Loan/reducer/loanReducer';
import savingsReducer from '../../screens/Savings/reducer/savingsReducer';
import marketReducer from '../../screens/Market/reducer/marketReducer';
import walletReducer from '../../screens/Wallet/reducer/walletReducer';
import toastReducer from '../../components/Toast/toastReducer';
// import transferReducer from '../../screens/Wallet/reducer/transferReducer';
// import billsReducer from '../../screens/Bills/reducer/billsReducer';


export default combineReducers({
    authentication: authReducer,
    home: homeReducer,
    account: accountReducer,
    loan: loanReducer,
    savings: savingsReducer,
    transaction: transactionReducer,
    market: marketReducer,
    toast: toastReducer,
    wallet: walletReducer,
    // transfer: transferReducer,
    // bills: billsReducer,
});

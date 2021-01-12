import constants from './constants';


const initialSettings = {
    user: { data: {}, error: null, loading: false},
    bank: { data: [], error: null, loading: false},
    paystack1: { data: {}, error: null, loading: false},
    paystack2: { data: {}, error: null, loading: false},
    bvn: { data: {}, error: null, loading: false},
};

const activitys = (state = initialSettings, action) => {
  switch (action.type) {
    case constants.user.SET_ERROR:
      return {
        ...state,
        user: { ...state.user, error: action.error }
      };
    case constants.user.SET_LOADING:
      return {
        ...state,
        user: { ...state.user, loading: action.loading }
      };
    case constants.user.SET_DATA:
      return {
        ...state,
        user: { ...state.user, data: action.data }
    };


    case constants.bank.SET_ERROR:
      return {
        ...state,
        bank: { ...state.bank, error: action.error }
      };
    case constants.bank.SET_LOADING:
      return {
        ...state,
        bank: { ...state.bank, loading: action.loading }
      };
    case constants.bank.SET_DATA:
      return {
        ...state,
        bank: { ...state.bank, data: action.data }
    };



    case constants.bvn.SET_DATA:
      return {
        ...state,
        bvn: { ...state.bvn, data: action.data }
    };



    case constants.paystack1.SET_DATA:
      return {
        ...state,
        paystack1: { ...state.paystack1, data: action.data }
    };


    case constants.paystack2.SET_DATA:
      return {
        ...state,
        paystack2: { ...state.paystack2, data: action.data }
    };



   
    default:
      return state;
  }
};

export default activitys;

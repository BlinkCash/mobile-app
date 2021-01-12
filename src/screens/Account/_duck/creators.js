import requestHandler from '../../../utils/apiRequestHandlers';

export default {
    getUser: (country)=> requestHandler.get(`/me?include=role`),
    updatePersonalDetails: (personalDetails)=> requestHandler.patch(`/me/details`, personalDetails),
    updateBankDetails: (bankDetails)=> requestHandler.patch(`/me/details/bank`, bankDetails),
    updateEmploymentDetails: (employmentDetails)=> requestHandler.patch(`/me/details/employment`, employmentDetails),
    updatePinDetails: (pin)=> requestHandler.pin(`/password/reset`, pin),
    getAllBanks: ()=> requestHandler.get(`/banklist`),
    verifyBvn: (bvn) => requestHandler.get(`/me/verifybvn/${bvn}`),
    verifyAccount: (account) => requestHandler.post(`/bank/verifyaccount`, account),
    updateAvatar: (img) => requestHandler.fileUpdate(`/me/avatar`, img)
}


const userwallet={};
const Walletdb=require('../../models/UserModels/walletSchema');
const Userdb=require('../../models/UserModels/UserSignupSchema');
userwallet.getwalletpage = async (req, res) => {
    try {
        const datas = await Walletdb.findOne({ userId: req.session.userid });
        const user = await Userdb.findOne({ _id: req.session.userid });
        const userName = user.name;

        if (datas) {
            console.log("in the data", datas);
            res.render('userViews/walletdetails', { datas, userName, message: '' });
        } else {
            res.render('userViews/walletdetails', { datas: [], userName, message: 'No Wallet found in Wallets.' });
        }
    } catch (error) {
        console.error('Error fetching wallet data:', error);
        res.status(500).render('userViews/walletdetails', { datas: [], userName: '', message: 'An error occurred while fetching wallet data.' });
    }
};






module.exports=userwallet;
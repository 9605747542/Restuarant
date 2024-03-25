const isLogged=(req,res,next)=>{
    if(req.session.Usersession){
        console.log('User Side Working');
        next()
    }else{
        res.redirect('/')
    }
}
// const isForgot=(req,res,next)=>{
//     if(req.session.forgorUser){
//         console.log('Forgot Password Working');
//         next()
//     }else{
//         res.redirect('/');
//     }
// }

module.exports = isLogged;
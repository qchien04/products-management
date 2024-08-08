

const Cart=require("../../models/cart.model");

module.exports.cartId= async(req,res,next)=>{
    if(!req.cookies.cartId){
        const cart=new Cart();
        await cart.save();

        const expiresCookie= 365*24*60*60*1000;

        res.cookie("cartId",cart.id,{
            expires: new Date(Date.now()+ expiresCookie)
        });
        req.cookies.cartId=cart.id;
    }else{
        const cart= await Cart.findOne({
            _id:req.cookies.cartId
        });

        cart.totalQuantity=cart.products.reduce((sum,item)=>item.quantity+sum,0);
        res.locals.miniCart=cart;

    }
    next();
}
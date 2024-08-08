
const productsHelper=require("../../helpers/products");

//[GET] /search
const Product=require("../../models/product.model");


module.exports.index= async (req, res) => {
    const keyword=req.query.keyword;

    let newProducts=[];
    if(keyword){
        const regex=new RegExp(keyword,"i");
        const products= await Product.find({
            title: regex,
            deleted:false,
            status:"active",
        });
        newProducts=productsHelper.priceNewProducts(products);
    }

    res.render("client/pages/search/index",{
        pageTitle:"Danh sách sản phẩm",
        keyword:keyword,
        products:newProducts
    });
};

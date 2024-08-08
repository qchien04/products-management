const Product=require("../../models/product.model");
const ProductCategory=require("../../models/product-category.model");
const productsHelper=require("../../helpers/products");

//[GET] /
module.exports.index=async (req, res) => {
    
    const productsFeatured=await Product.find({
        featured: "1",
        deleted:false,
        status:"active",
    });

    const newProductsFeatured=productsHelper.priceNewProducts(productsFeatured);

    //sp moi
    const productsNew=await Product.find({
        deleted:false,
        status:"active"
    }).sort({position:"desc"}).limit(6);
    const newProductsNew=productsHelper.priceNewProducts(productsNew);

    res.render("client/pages/home/index",{
        pageTitle:"Trang chủ",
        productsFeatured:newProductsFeatured,
        productsNew:newProductsNew,
    });
};
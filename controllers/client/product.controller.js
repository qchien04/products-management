
//[GET] /products
const Product=require("../../models/product.model");
module.exports.index= async (req, res) => {
    const products=await Product.find({
        status:"active",
        deleted:false
    })
    .sort({position: "desc"});

    const newProducts=products.map(item=>{
        item.priceNew=(item.price*(100-item.discountPercentage)/100).toFixed(1);
        return item;
    });

    //console.log(newProducts);

    res.render("client/pages/products/index",{
        pageTitle:"Danh sách sản phẩm",
        products:newProducts
    });
};

//[GET] /products/:slug
module.exports.detail= async (req, res) => {
    //console.log(req.params.slug);
    try {
        const find={
            deleted:false,
            slug:req.params.slug,
            status:"active"
        }
        const product= await Product.findOne(find);

        res.render("client/pages/products/detail",{
            pageTitle:product.title,
            product:product
        });
    } catch (error) {
        req.flash("error","Lỗi!");
        res.redirect('/products');
    }
};
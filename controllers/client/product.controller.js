const productsHelper=require("../../helpers/products");
const ProductCategory=require("../../models/product-category.model");
const productsCategoryHelper=require("../../helpers/products-category");

//[GET] /products
const Product=require("../../models/product.model");
module.exports.index= async (req, res) => {
    const products=await Product.find({
        status:"active",
        deleted:false
    })
    .sort({position: "desc"});

    const newProducts=productsHelper.priceNewProducts(products);

    //console.log(newProducts);

    res.render("client/pages/products/index",{
        pageTitle:"Danh sách sản phẩm",
        products:newProducts
    });
};

//[GET] /products/detail/:slug
module.exports.detail= async (req, res) => {
    try {
        const find={
            deleted:false,
            slug:req.params.slugProduct,
            status:"active"
        }
         const product= await Product.findOne(find);

        if(product.product_category_id){
            const category= await ProductCategory.findOne({
                _id:product.product_category_id,
                status:"active",
                deleted:false,
            });
            product.category=category;
        }
        product.priceNew=productsHelper.priceNewProduct(product);
        res.render("client/pages/products/detail",{
            pageTitle:product.title,
            product:product
        });
    } catch (error) {
        req.flash("error","Lỗi trang product/slug!");
        res.redirect('/products');
    }
};

//[GET] /products/:slugCategory
module.exports.category= async (req, res) => {
    //console.log(req.params.slug);
    try {

        const category=await ProductCategory.findOne({
            slug: req.params.slugCategory,
            deleted:false,
        });

        const listSubCategory=await productsCategoryHelper.getSubCategory(category.id);

        const listSubCategoryId=listSubCategory.map(item=>item.id);
        const find={
            deleted:false,
            product_category_id:{$in:[category.id,...listSubCategoryId]},
            status:"active"
        }

        const products= await Product.find(find).sort({position:"desc"});

        const newProducts=productsHelper.priceNewProducts(products);

        res.render("client/pages/products/index",{
            pageTitle:"Danh sách sản phẩm",
            products:newProducts
        });
    } catch (error) {
        req.flash("error","Lỗi slu category!");
        res.redirect('/products');
    }
};
//[GET] /admin/products
const Product=require("../../models/product.model");

const filterStatusHelper=require("../../helpers/filterStatus");
const searchHelper=require("../../helpers/search");
const paginationHelper=require("../../helpers/pagination");

const systemConfig=require("../../config/system")
//[Get] /admin/products
module.exports.index= async (req, res) => {

    //FE cho xu ly tim kiem theo muc
    const filterStatus=filterStatusHelper(req.query);

    //BE loc chuc nang tim kiem theo muc
    let find={
        deleted:false
    };
    if(req.query.status){
        find.status=req.query.status;
    }
    //tim kiem tren thanh tim kiem
    const objectSearch=searchHelper(req.query);
    if(objectSearch.regex){
        find.title=objectSearch.regex;
    }

    //phan trang
    const countProducts=await Product.countDocuments(find);
    let objectPagination=paginationHelper(
        {
            currentPage:1,
            limitItem:4
        },
        req.query,
        countProducts
    );
    const products=await Product.find(find)
    .sort({position: "desc"})
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

    //console.log(products);

    res.render("admin/pages/products/index",{
        pageTitle:"Danh sách sản phẩm",
        products: products,
        filterStatus:filterStatus,
        keyword: objectSearch.keyword,
        pagination:objectPagination
    });
    //res.send("trang product");
};

//[Path] /admin/products/change-status/:status/:id
module.exports.changeStatus= async (req,res)=>{
    const status=req.params.status;
    const id=req.params.id;
    await Product.updateOne({_id:id},{status:status});

    req.flash("success","Cập nhập thành công!");

    res.redirect("back");
};

//[Path] /admin/products/change-multi
module.exports.changeMulti= async (req,res)=>{
    const type=req.body.type;
    const ids=req.body.ids.split(", ");
    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids} },{status:"active"});
            req.flash("success","Cập nhập thành công!");
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids} },{status:"inactive"});
            req.flash("success","Cập nhập thành công!");
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids} },{
                deleted:true,
                deletedAt: new Date()

            });
            req.flash("success","Xóa thành công!");
            break;
        case "change-position":
            for(const item of ids){
                let[id,position]=item.split("-");
                position=parseInt(position);
                await Product.updateOne({_id: id },{
                        position: position
                    }
                );
                req.flash("success","Đổi vị trí thành công!");
            }
            break;
        default:    


            break;
    }
    res.redirect("back");
};

//[Delete] /admin/products/delete/:id
module.exports.deleteItem= async (req,res)=>{
    const id=req.params.id;
    await Product.updateOne({_id: id},{
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success","Xóa thành công!");
    res.redirect("back");
};

//[Get] /admin/products/create
module.exports.create= async (req,res)=>{
    //console.log("ok");
    res.render("admin/pages/products/create",{
        pageTitle:"Thêm mới sản phẩm",
    });
};


//[Post] /admin/products/create
module.exports.createPost= async (req,res)=>{
    req.body.price=parseInt(req.body.price);
    req.body.stock=parseInt(req.body.stock);
    req.body.discountPercentage=parseInt(req.body.discountPercentage);


    if(req.body.position==""){
        const countProducts= await Product.countDocuments({});
        req.body.position=countProducts+1;
    }
    else{
        req.body.position=parseInt(req.body.position);
    }
    const product=new Product(req.body);
    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);

};

//[Get] /admin/products/edit
module.exports.edit= async (req,res)=>{
    try {
        const id=req.params.id;
        const find={
            deleted:false,
            _id:id
        }
        const product= await Product.findOne(find);

        res.render("admin/pages/products/edit",{
            pageTitle:"Chỉnh sửa sản phẩm",
            product:product
        });
    } catch (error) {
        req.flash("error","Lỗi!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};

module.exports.editPatch= async (req,res)=>{
    const id=req.params.id;
    req.body.price=parseInt(req.body.price);
    req.body.stock=parseInt(req.body.stock);
    req.body.discountPercentage=parseInt(req.body.discountPercentage);
    req.body.position=parseInt(req.body.position);
    if(req.file){
        req.body.thumbnail=`/uploads/${req.file.filename}`;
    }
    try {
        await Product.updateOne(
            {_id:id},
            req.body
        );
        req.flash("success","Cập nhật thành công!");
    } catch (error) {
        
    }
    res.redirect("back");
};

//Get admin/products/detail

module.exports.detail= async (req,res)=>{
    try {
        const id=req.params.id;
        const find={
            deleted:false,
            _id:id
        }
        const product= await Product.findOne(find);
        console.log(product);
        res.render("admin/pages/products/detail",{
            pageTitle:product.title,
            product:product
        });
    } catch (error) {
        req.flash("error","Lỗi!");
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
};
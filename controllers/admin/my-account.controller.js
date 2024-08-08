const Account=require("../../models/account.model");
const md5=require("md5");
const systemConfig=require("../../config/system")


//[GET] /admin/my-account
module.exports.index=(req, res) => {
    res.render("admin/pages/my-account/index",{
        pageTitle:"Trang thông tin cá nhân"
    });
};

//[get] /admin/my-account/edit
module.exports.edit=async (req, res) => {
    res.render("admin/pages/my-account/edit",{
        pageTitle:"Chỉnh sửa acc",
    });

};

//[Patch] /admin/my-account/edit/
module.exports.editPatch= async (req,res)=>{
    const id=res.locals.user.id;

    const emailExits= await Account.findOne({
        _id:{ $ne:id},
        email: req.body.email,
        deleted:false
    });

    if(emailExits){
        req.flash("error","Email đã tồn tại");
    }else{
        if(req.body.password){
            req.body.password=md5(req.body.password)
        }else{
            delete req.body.password;
        }
        try {
            await Account.updateOne(
                {_id:id},
                req.body
            );
            req.flash("success","Cập nhật thành công!");
        } catch (error) {
            req.flash("error","Cập nhật thất bại");
        }
    }
    res.redirect("back");
};
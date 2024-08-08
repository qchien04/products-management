
const Account=require("../../models/account.model");
const Role=require("../../models/role.model");

const systemConfig=require("../../config/system")

const md5=require("md5");

//[GET] /admin/accounts
module.exports.index=async (req, res) => {

    let find={
        deleted:false
    };

    const records=await Account.find(find).select("-password -token");

    for(const record of records){
        const role= await Role.findOne({
            deleted:false,
            _id:record.role_id,
        })
        record.role=role
    }


    res.render("admin/pages/accounts/index",{
        pageTitle:"Danh sách tài khoản",
        records:records
    });
};

//[GET] /admin/accounts/create
module.exports.create=async (req, res) => {
    const roles =await Role.find({
        deleted:false,
    });

    res.render("admin/pages/accounts/create",{
        pageTitle:" Tạo tài khoản",
        roles:roles
    });
};

//[Post] /admin/accounts/create
module.exports.createPost=async (req, res)=> {
    const emailExits= await Account.findOne({
        email: req.body.email,
        deleted:false
    });

    if(emailExits){
        req.flash("error","Email đã tồn tại");
        res.redirect("back");
    }else{
        req.body.password=md5(req.body.password);
        const record=new Account(req.body);
        await record.save()
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }

};

//[get] /admin/accounts/edit
module.exports.edit=async (req, res) => {
    try {
        const id=req.params.id;
        const find={
            deleted:false,
            _id:id
        }
        const data= await Account.findOne(find);
        const roles= await Role.find({
            deleted:false
        });

        res.render("admin/pages/accounts/edit",{
            pageTitle:"Chỉnh sửa acc",
            data:data,
            roles:roles
        });
    } catch (error) {
        req.flash("error","Lỗi!");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

//[Patch] /admin/accounts/edit/:id
module.exports.editPatch= async (req,res)=>{
    const id=req.params.id;

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
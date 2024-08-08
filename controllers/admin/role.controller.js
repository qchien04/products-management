
const Role=require("../../models/role.model");

const systemConfig=require("../../config/system")


//[GET] /admin/role
module.exports.index=async (req, res) => {

    let find={
        deleted:false
    };

    const records=await Role.find(find);


    res.render("admin/pages/roles/index",{
        pageTitle:"Nhóm quyền",
        records:records
    });
};

//[GET] /admin/roles/create
module.exports.create=async (req, res) => {

    res.render("admin/pages/roles/create",{
        pageTitle:" Tạo nhóm quyền",
    });
};

//[Post] /admin/roles/create
module.exports.createPost=async (req, res) => {

    const record=new Role(req.body);
    await record.save()
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
};

//[get] /admin/roles/edit
module.exports.edit=async (req, res) => {
    try {
        const id=req.params.id;
        const find={
            deleted:false,
            _id:id
        }
        const data= await Role.findOne(find);
    

        res.render("admin/pages/roles/edit",{
            pageTitle:"Chỉnh sửa quyền",
            data:data
        });
    } catch (error) {
        req.flash("error","Lỗi!");
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
};

//[Patch] /admin/roles/edit
module.exports.editPatch= async (req,res)=>{
    const id=req.params.id;
    try {
        await Role.updateOne(
            {_id:id},
            req.body
        );
        req.flash("success","Cập nhật thành công!");
    } catch (error) {
        
    }
    res.redirect("back");
};

//[get] /admin/roles/permissions
module.exports.permission=async (req, res) => {
    const find={
        deleted:false,
    }
    const records= await Role.find(find);

    res.render("admin/pages/roles/permissions",{
        pageTitle:"Phân quyền",
        records:records
    });

};

//[Pathc] /admin/roles/permissions
module.exports.permissionPatch=async (req, res) => {
    try {
        const permissions=JSON.parse(req.body.permissions);
    
        for(const item of permissions){
            await Role.updateOne({_id:item.id},{permissions:item.permissions});

        }
        req.flash("success","Cập nhập thành công");
    } catch (error) {
        req.flash("error","Cập nhập thất bại");
    }

    res.redirect("back");


};
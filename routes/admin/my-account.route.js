
const express= require("express");
const router=express.Router();

const multer=require("multer");

// const storageMulter=require("../../helpers/storageMulter");//tao anh vao file
// const upload=multer({storage:storageMulter()});
const upload=multer();


const controller=require("../../controllers/admin/my-account.controller");

const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware");


router.get("/", controller.index);

router.get("/edit", controller.edit);

router.patch("/edit",
    upload.single('avatar'), //dung de load hinh anh len req
    uploadCloud.upload,
    controller.editPatch
    );

module.exports=router;
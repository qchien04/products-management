
const express= require("express");
const router=express.Router();
const multer=require("multer");

// const storageMulter=require("../../helpers/storageMulter");//tao anh vao file
// const upload=multer({storage:storageMulter()});
const upload=multer();

const controller=require("../../controllers/admin/product-category.controller");

const validate=require("../../validates/admin/product-category.validate");

const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware");
router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create",
    upload.single('thumbnail'), //dung de load hinh anh len req
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
    );

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    upload.single('thumbnail'), //dung de load hinh anh len req
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
    );


module.exports=router;
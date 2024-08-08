//show alert

const showAlert=document.querySelector("[show-alert]");
if(showAlert){
    const time=parseInt(showAlert.getAttribute("data-time"));
    const closeAlert=showAlert.querySelector("[close-alert]");
    setTimeout(()=>{
        showAlert.classList.add("alert-hidden");
    },time);
    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden");
    });
}

//upload image
const uploadImage=document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput=document.querySelector("[upload-image-input]");
    const uploadImagePreview=document.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change",(e)=>{
        const file= e.target.files[0];
        if(file){
            uploadImagePreview.src=URL.createObjectURL(file);
        }
    });
}
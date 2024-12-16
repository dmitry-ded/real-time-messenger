// import { rejects } from "assert";
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";


// const upload = async (file) => {

//   const storage = getStorage();

//   // Create the file metadata
//   /** @type {any} */
//   const metadata = {

//   };

//   const date = new Date();
//   const dateString = date.toISOString(); 
//   const storageRef = ref(storage, `images/${dateString + file.name}`);
//   console.log(storageRef, "storageRef");
  
//   const uploadTask = uploadBytesResumable(storageRef, file, metadata);

//   return new Promise((resolve, reject) => {

//     uploadTask.on('state_changed',
//       (snapshot) => {
//         const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         console.log('Upload is ' + progress + '% done');
//       }, 
//       (error) => {
//         reject("Что-то пошло не так" + error.code);
//       }, 
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//           resolve(downloadURL);
//         });
//       }
//     );
//   });
// }


// export default upload;
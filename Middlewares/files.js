import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'staticFile/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).single("file");

const uploadImage = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error uploading image");
        }
        next();
    });
};

export default uploadImage;

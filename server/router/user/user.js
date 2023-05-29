import express from "express";
import { Crime } from "../../model/Crime.js";
import multer from "multer";
const router = express.Router();
import fs from "fs";
import path from "path";

const upload = multer({ dest: "uploads/" });

router.post("/reportCrime", upload.array("images", 5), async (req, res) => {
  try {
    const names = [];
    if (req.files && req.files.length !== 0) {
      req.files.map((file, index) => {
        const customFileName = String(Math.random());
        const fileExtension = path.extname(file.originalname);
        const fileName = customFileName
          ? `${customFileName}${fileExtension}`
          : file.filename;

        const destinationPath = path.join("uploads/", fileName);
        fs.renameSync(file.path, destinationPath);
        names.push(fileName);

        return {
          originalname: file.originalname,
          filename: fileName,
          size: file.size,
        };
      });
    }

    const crime = new Crime({ ...req.body, images: names });
    await crime.save();
    res.send({ success: true, message: "Tip submitted successfully" });
  } catch (error) {
    res.status(400).send({ success: false, message: error?.message });
  }
});

export default router;

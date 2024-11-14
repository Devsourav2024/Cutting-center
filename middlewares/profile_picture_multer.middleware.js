const multer = require("multer");
const path = require("path");
const fs = require("fs");

// const DxfParser = require("dxf-parser");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../ProfilePictures"));
  },
  filename: function (req, file, callback) {
    console.log("File: ", file);
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, uniquePrefix + "-" + file.originalname);
  },
});

const storageRigid = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../rigidfile"));
  },
  filename: function (req, file, callback) {
    console.log("File: ", file);
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, uniquePrefix + "-" + file.originalname);
  },
});

const storageRigidImage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__dirname, "../rigidimage"));
  },
  filename: function (req, file, callback) {
    console.log("File: ", file);
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    callback(null, uniquePrefix + "-" + file.originalname);
  },
});

const profilePic = multer({
  storage: storage,
}).single("image");

const rigidImage = multer({
  storage: storageRigid,
}).single("image");

const rigidImageFile = multer({
  storage: storageRigidImage,
  limits: { fileSize: 80 * 1024 * 1024 }, // 50 MB limit
}).single("file");

/* const rigidImage = function () {
  const parser = new DxfParser();

  // Read DXF file
  // const dxfString = fs.readFileSync("../rigidfile", "utf8");
  const dxfString = fs.readFileSync("../rigidfile", "utf8");

  // Parse DXF data
  let dxfData;
  try {
    dxfData = parser.parseSync(dxfString);
  } catch (err) {
    console.error("Error parsing DXF file:", err);
  }

  // Create a canvas and context
  const canvas = createCanvas(1000, 1000); // Set canvas size accordingly
  const ctx = canvas.getContext("2d");

  // Function to draw parsed DXF data (simplified example)
  function drawEntity(entity, ctx) {
    if (entity.type === "LINE") {
      ctx.beginPath();
      ctx.moveTo(entity.vertices[0].x, entity.vertices[0].y);
      ctx.lineTo(entity.vertices[1].x, entity.vertices[1].y);
      ctx.stroke();
    }
  }

  // Loop through DXF entities and draw them
  if (dxfData && dxfData.entities) {
    dxfData.entities.forEach((entity) => {
      drawEntity(entity, ctx);
    });
  }

  // Save as a JPG image
  const out = fs.createWriteStream("output.jpg");
  const stream = canvas.createJPEGStream();
  stream.pipe(out);
  out.on("finish", () => {
    console.log("JPG file created.");
  });
}; */

module.exports = { profilePic, rigidImage, rigidImageFile };

const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");

const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} = require("../controllers/serviceController");

router.post("/admin/add-service", upload.single("image"), createService);

router.get("/services", getAllServices);
router.get("/services/:id", getServiceById);

router.patch("/admin/services/:id", upload.single("image"), updateService);

router.delete("/admin/services/:id", deleteService);

module.exports = router;

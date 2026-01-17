const Service = require("../models/Service");
const path = require("path");
const fs = require("fs");

exports.createService = async (req, res, next) => {
  try {
    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    if (!title || !description || !price) {
      return res
        .status(400)
        .json({ message: "Title, description and price are required" });
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }

    const newService = new Service({
      title,
      image: req.file.path,
      description,
      price: parsedPrice,
    });

    await newService.save();

    res.status(201).json({
      message: "Service created successfully",
      service: newService,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 }).lean();

    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).lean();

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const serviceId = req.params.id;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (title) service.title = title;
    if (description) service.description = description;
    if (price) {
      const parsedPrice = Number(price);
      if (!isNaN(parsedPrice) && parsedPrice > 0) {
        service.price = parsedPrice;
      } else {
        return res.status(400).json({ message: "Invalid price value" });
      }
    }

    if (req.file) {
      // Delete old image if exists and is not default
      if (service.image && service.image !== "uploads/default-service.jpg") {
        const oldPath = path.join(__dirname, "..", service.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      service.image = req.file.path;
    }

    await service.save();

    res.json({
      message: "Service updated successfully",
      service,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.image && service.image !== "uploads/default-service.jpg") {
      const imagePath = path.join(__dirname, "..", service.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Service.findByIdAndDelete(req.params.id);

    res.json({ message: "Service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

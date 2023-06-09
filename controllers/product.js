const Product = require("../models/Project");
const ErrorHander = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAcyncError");
const ApiFeatures = require("../utils/apiFeatures");
const cloudinary = require("cloudinary");

createProduct = catchAsyncError(async (req, res, next) => {

    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  });

  getAllProducts = catchAsyncError(async (req, res) => {
    const productsCount = await Product.countDocuments();
    const resultsPerPage = 8;
    const apiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(resultsPerPage);
    const products = await apiFeature.query;
    res.status(200).json({
      success: true,
      products,
      productsCount,
      resultsPerPage,
    });
  });

 getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
  
    res.status(200).json({
      success: true,
      products,
    });
  });

  getProductDeatils = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    res.status(200).json({
      success: true,
      product,
    });
  });

  updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
      product,
    });
  });

 deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    await product.deleteOne();
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  });

  module.exports = {
    createProduct,
    getAllProducts,
    getAdminProducts,
    getProductDeatils,
    updateProduct,
    deleteProduct
}
  
  

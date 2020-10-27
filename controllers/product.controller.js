const service = require("./../services/product.service")
const constant = require("./../constant")

module.exports.showProduct = async (req, res, next) => {
    try {
        const productList = await service.showProduct(req);
        return res.status(200).send({
            message: constant.RETRIEVED_SUCCESSFUL,
            product: productList
        })
    } catch (error) {
        next(error);
    }
};

module.exports.productDetails = async (req, res, next) => {
    try {
        const items = await service.productDetails(req);
        return res.status(200).send({
            message: constant.RETRIEVED_SUCCESSFUL,
            product: items
        })
    } catch (error) {
        next(error);
    }
}


module.exports.favorite = async (req, res, next) => {
    try {
        await service.favorite(req);
        return res.status(200).send({
            message: constant.LIKED,
        })
    } catch (error) {
        next(error);
    }
};

module.exports.displayFavorList = async (req, res, next) => {
    try {
        const list = await service.favorList(req);
        return res.status(200).send({
            message: constant.RETRIEVED_SUCCESSFUL,
            items: list
        })
    } catch (error) {
        next(error)
    }
};

module.exports.disLiked = async (req, res, next) => {
    try {
        const result = await service.disLiked(req);
        return res.status(200).send({
            message: constant.UNLIKED,
            result: result
        })
    } catch (error) {
        next(error)
    }
};

module.exports.getCategories = async (req, res, next) => {
    try {
        const categories = await service.getCategories(req);
        return res.status(200).send({
            message: constant.CATEGORY_RETRIEVED_SUCCESSFUL,
            category: categories
        })
    } catch (error) {
        next(error);
    }
};

module.exports.searchProduct = async (req, res, next) => {
    try {
        const result = await service.searchProduct(req);
        return res.status(200).send({
            message: constant.SEARCH_SUCCESSFUL,
            result: result
        })
    } catch (error) {
        next(error);
    }
};

module.exports.showTopItem = async (req, res, next) => {
    try {
        const items = await service.showTopItem();
        return res.status(200).send({
            message: constant.QUERY_SUCCESSFUL,
            item: items
        })
    } catch (error) {
        next(error)
    }
}
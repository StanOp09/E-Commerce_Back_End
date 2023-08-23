const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [Category, { model: Tag, through: ProductTag }], // Include associated Category and Tag data
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [Category, { model: Tag, through: ProductTag }], // Include associated Category and Tag data
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body, {
      include: [Tag], // Include associated Tags
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIds = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(productTagIds);
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT (update) a product by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!updatedProduct[0]) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (req.body.tagIds && req.body.tagIds.length) {
      await ProductTag.destroy({
        where: { product_id: req.params.id },
      });

      const newProductTags = req.body.tagIds.map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });

      await ProductTag.bulkCreate(newProductTags);
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProduct) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    res.status(200).json(deletedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

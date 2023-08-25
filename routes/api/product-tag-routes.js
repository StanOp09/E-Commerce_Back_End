const router = require('express').Router();
const { ProductTag } = require('../../models');

// POST a new product tag
router.post('/', async (req, res) => {
  try {
    const newProductTag = await ProductTag.create(req.body);
    res.status(201).json(newProductTag);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE a product tag by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedProductTag = await ProductTag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deletedProductTag) {
      res.status(404).json({ message: 'Product tag not found' });
      return;
    }

    res.status(200).json(deletedProductTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

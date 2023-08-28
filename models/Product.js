const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Product extends Model {}

Product.init(
  {
    // Define columns
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // 10 digits in total, 2 decimal places
      allowNull: false,
      validate: {
        isDecimal: true,
      },
      get() {
        // This function ensures that the price is always formatted with 2 decimal places
        const rawValue = this.getDataValue('price');
        return parseFloat(rawValue).toFixed(2);
      },
      set(value) {
        // This function ensures that the stored value is always rounded to 2 decimal places
        this.setDataValue('price', parseFloat(value).toFixed(2));
      },
    },
    
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        isNumeric: true,
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'product',
  }
);

module.exports = Product;

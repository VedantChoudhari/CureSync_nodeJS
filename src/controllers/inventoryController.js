const Inventory = require('../models/Inventory');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');


// Create new inventory item
exports.createItem = async (req, res) => {
  try {
    const { itemName, quantity, unit, description, status } = req.body;
    const item = await Inventory.create({ itemName, quantity, unit, description, status });
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all inventory items
exports.getItems = async (req, res) => {
  try {
    const items = await Inventory.findAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single item by ID
exports.getItem = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an inventory item
exports.updateItem = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an inventory item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    await item.destroy();
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//inventory csv


exports.exportInventoryCSV = async (req, res) => {
  try {
    const inventory = await Inventory.findAll();

    const data = inventory.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      category: i.category,
      status: i.status
    }));

    const fields = ['id', 'name', 'quantity', 'category', 'status'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    const filePath = path.join(__dirname, '../../uploads/inventory.csv');
    fs.writeFileSync(filePath, csv);

    res.download(filePath, 'inventory.csv');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
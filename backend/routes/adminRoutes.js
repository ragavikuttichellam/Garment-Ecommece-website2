const express = require('express');
const {
  getUsers,
  deleteUser,
  updateUserRole,
  getOrders,
  getProducts,
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/orders', protect, admin, getOrders);
router.get('/products', protect, admin, getProducts);

module.exports = router;
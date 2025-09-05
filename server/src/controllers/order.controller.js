import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import sendEmail from '../utils/sendEmail.js'; // --- IMPORT OUR NEW EMAIL SERVICE ---

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      // --- Fetch product details to get seller IDs ---
      const productIds = orderItems.map((item) => item._id);
      const productsFromDB = await Product.find({ _id: { $in: productIds } });

      const productMap = productsFromDB.reduce((map, product) => {
        map[product._id] = product.user; // Map productId to sellerId (user)
        return map;
      }, {});

      const order = new Order({
        // --- Add seller to each order item ---
        orderItems: orderItems.map((x) => ({
          ...x,
          product: x._id,
          seller: productMap[x._id], // seller’s user ID
          _id: undefined,
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice: Number(itemsPrice),
        taxPrice: Number(taxPrice),
        shippingPrice: Number(shippingPrice),
        totalPrice: Number(totalPrice),
      });

      const createdOrder = await order.save();

      // --- SEND EMAIL CONFIRMATION ---
      try {
        await sendEmail({
          to: req.user.email,
          subject: `Order Confirmation - #${createdOrder._id}`,
          html: `
            <h1>Thank you for your order!</h1>
            <p>Your order with ID <strong>#${createdOrder._id}</strong> has been placed successfully.</p>
            <p>Total Amount: <strong>₹${createdOrder.totalPrice}</strong></p>
            <p>We will notify you once your order has been shipped.</p>
          `,
        });
      } catch (emailError) {
        console.error('Email could not be sent:', emailError);
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    console.error('ERROR PLACING ORDER:', error);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
  // 👉 implement Razorpay order creation here
};

// @desc    Verify Razorpay payment & update order status
// @route   POST /api/orders/:id/pay
// @access  Private
const verifyPaymentAndUpdateOrder = async (req, res) => {
  // 👉 implement Razorpay signature verification & order update here
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- NEW FUNCTION TO GET A SELLER'S SALES ---
// @desc    Get all orders containing a seller's products
// @route   GET /api/orders/mysales
// @access  Private/Seller
const getMySales = async (req, res) => {
  try {
    const orders = await Order.find({ 'orderItems.seller': req.user._id })
      .populate('user', 'name email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- UPDATED FUNCTION TO UPDATE ORDER STATUS ---
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/SellerOrAdmin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      // Security Check
      const isSellerOfItem = order.orderItems.some(
        (item) => item.seller.toString() === req.user._id.toString()
      );
      if (!isSellerOfItem && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized to update this order' });
      }

      order.status = status;
      if (status === 'Delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();

      // --- SEND SHIPPING NOTIFICATION EMAIL ---
      if (updatedOrder.status === 'Shipped') {
        try {
          const orderWithUser = await Order.findById(updatedOrder._id).populate('user', 'email');
          await sendEmail({
            to: orderWithUser.user.email,
            subject: `Your Order Has Shipped! - #${updatedOrder._id}`,
            html: `
              <h1>Your order is on its way!</h1>
              <p>Your order with ID <strong>#${updatedOrder._id}</strong> has been shipped and will be delivered soon.</p>
              <p>You can track your order in your profile.</p>
            `,
          });
        } catch (emailError) {
          console.error('Shipping email could not be sent:', emailError);
        }
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export {
  addOrderItems,
  getOrderById,
  getMyOrders,
  createRazorpayOrder,
  verifyPaymentAndUpdateOrder,
  getOrders,
  updateOrderToDelivered,
  getMySales,
  updateOrderStatus,
};
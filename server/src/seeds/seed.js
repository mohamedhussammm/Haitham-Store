const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Expense = require('../models/Expense');

const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Coupon.deleteMany(),
      Expense.deleteMany(),
    ]);

    // ========================
    // 1. Create Admin User
    // ========================
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      firstName: 'Haitham',
      lastName: 'Admin',
      email: 'admin@haithamstore.com',
      password: 'admin123',
      role: 'admin',
      phone: '+962791234567',
    });

    // Create test user
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      password: 'user123',
      role: 'user',
      phone: '+962791111111',
    });

    // ========================
    // 2. Create Categories
    // ========================
    console.log('📁 Creating categories...');
    const categories = await Category.create([
      { name: 'Face Towels', description: 'Premium disposable face towels for daily skincare' },
      { name: 'Body Towels', description: 'Soft and absorbent body towels' },
      { name: 'Bundles', description: 'Value bundles and combo packs' },
      { name: 'Travel', description: 'Travel-sized products for on the go' },
      { name: 'Accessories', description: 'Skincare accessories and tools' },
    ]);

    const [faceTowels, bodyTowels, bundles, travel, accessories] = categories;

    // ========================
    // 3. Create Products
    // ========================
    console.log('📦 Creating products...');
    const products = await Product.create([
      {
        name: 'Face Towel',
        description: '50 single-use, large, biodegradable face towels. Made from plant-based materials, our face towels are clean, soft, and absorbent — perfect for daily skincare routines.',
        highlights: [
          '50 single-use large towels for daily skincare',
          'Clean and completely bacteria-free experience',
          'Soft making them gentle on your skin\'s barrier',
          'Absorbent and durable for multipurpose use',
          'Plant-Based made from biodegradable materials',
        ],
        uses: [
          'Face drying: enjoy a clean and safe face-drying experience after every wash',
          'Makeup removing: add micellar water for effortless daily makeup removal',
          'Mask removing: wet the towel to gently cleanse mask residue away',
        ],
        price: 10,
        compareAtPrice: null,
        discount: 0,
        prices: { JOD: 10, EGP: 135 },
        images: [
          { url: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600&h=600&fit=crop', alt: 'Face Towel Box' },
          { url: 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=600&h=600&fit=crop', alt: 'Face Towel Close Up' },
          { url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop', alt: 'Face Towel in Use' },
        ],
        category: faceTowels._id,
        stock: 200,
        rating: 4.9,
        numReviews: 147,
      },
      {
        name: 'Golden Towel',
        description: 'Premium bamboo-infused golden face towels. Super soft, absorbent, and biodegradable. Our golden towels are the luxurious upgrade for your skincare routine.',
        highlights: [
          '50 single-use large towels for daily skincare',
          'Bamboo-infused for extra softness',
          'Super absorbent and biodegradable',
          'Hypoallergenic and dermatologist tested',
          'Premium gold packaging',
        ],
        uses: [
          'Face drying: the softest face-drying experience',
          'Makeup removing: effortless makeup removal with micellar water',
          'Sensitive skin: perfect for sensitive and acne-prone skin',
        ],
        price: 13,
        compareAtPrice: null,
        discount: 0,
        prices: { JOD: 13, EGP: 175 },
        images: [
          { url: 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&h=600&fit=crop', alt: 'Golden Towel Box' },
          { url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop', alt: 'Golden Towel Texture' },
          { url: 'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=600&h=600&fit=crop', alt: 'Golden Towel Pack' },
        ],
        category: faceTowels._id,
        stock: 150,
        rating: 4.8,
        numReviews: 93,
      },
      {
        name: 'Face Bundle',
        description: '3x Face Towel boxes at a discounted bundle price. Stock up and save on your daily skincare essentials.',
        price: 30,
        compareAtPrice: 40,
        discount: 25,
        prices: { JOD: 30, EGP: 405 },
        images: [
          { url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&h=600&fit=crop', alt: 'Face Bundle' },
          { url: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', alt: 'Face Bundle Pack' },
        ],
        category: bundles._id,
        isBundle: true,
        stock: 80,
        rating: 4.9,
        numReviews: 62,
        highlights: ['3x Face Towel boxes (150 towels total)', 'Save 25% vs buying individually', 'Free shipping included'],
        uses: ['Perfect for stocking up', 'Great as a gift set', 'Ideal for family use'],
      },
      {
        name: 'Golden Bundle',
        description: '3x Golden Towel boxes at a special bundle price. The ultimate luxury skincare towel experience.',
        price: 39,
        compareAtPrice: 52,
        discount: 25,
        prices: { JOD: 39, EGP: 527 },
        images: [
          { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop', alt: 'Golden Bundle' },
          { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&h=600&fit=crop', alt: 'Golden Bundle Pack' },
        ],
        category: bundles._id,
        isBundle: true,
        stock: 60,
        rating: 4.8,
        numReviews: 41,
        highlights: ['3x Golden Towel boxes (150 towels total)', 'Save 25% vs buying individually', 'Premium bamboo quality'],
        uses: ['Luxury skincare routine', 'Gift-worthy presentation', 'Sensitive skin care'],
      },
      {
        name: 'Travel Face Towel',
        description: 'Compact travel-sized face towels. Perfect for your bag, gym, or travel. 20 towels per pack.',
        price: 5,
        compareAtPrice: null,
        discount: 0,
        prices: { JOD: 5, EGP: 68 },
        images: [
          { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&h=600&fit=crop', alt: 'Travel Face Towel' },
          { url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop', alt: 'Travel Pack' },
        ],
        category: travel._id,
        stock: 300,
        rating: 4.7,
        numReviews: 88,
        highlights: ['20 compact towels per pack', 'Fits in your bag or purse', 'TSA-friendly packaging'],
        uses: ['Travel and flights', 'Gym sessions', 'Office touch-ups'],
      },
      {
        name: 'Golden Travel Bundle',
        description: 'Travel-sized golden towels bundle. 3 packs of 20 towels each, perfect for on-the-go luxury.',
        price: 15,
        compareAtPrice: 20,
        discount: 25,
        prices: { JOD: 15, EGP: 203 },
        images: [
          { url: 'https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=600&h=600&fit=crop', alt: 'Golden Travel Bundle' },
          { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop', alt: 'Travel Golden Pack' },
        ],
        category: bundles._id,
        isBundle: true,
        stock: 100,
        rating: 4.6,
        numReviews: 34,
        highlights: ['3x Travel Golden packs (60 towels)', 'Compact and portable', 'Save 25%'],
        uses: ['Frequent travelers', 'Gym goers', 'Weekend getaways'],
      },
      {
        name: 'Travel Bundle',
        description: 'Travel-sized face towels bundle. 3 packs, the perfect companion for your adventures.',
        price: 9,
        compareAtPrice: 12,
        discount: 25,
        prices: { JOD: 9, EGP: 122 },
        images: [
          { url: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&h=600&fit=crop', alt: 'Travel Bundle' },
          { url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop', alt: 'Travel Bundle Pack' },
        ],
        category: bundles._id,
        isBundle: true,
        stock: 120,
        rating: 4.7,
        numReviews: 55,
        highlights: ['3x Travel packs (60 towels)', 'Best value for travelers', 'Save 25%'],
        uses: ['Travel essentials', 'On-the-go skincare', 'Gift sets'],
      },
      {
        name: 'Body Towel XL',
        description: 'Extra-large disposable body towels. Thick, absorbent, and perfect for post-shower or gym.',
        price: 18,
        compareAtPrice: null,
        discount: 0,
        prices: { JOD: 18, EGP: 243 },
        images: [
          { url: 'https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=600&h=600&fit=crop', alt: 'Body Towel XL' },
          { url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=600&fit=crop', alt: 'Body Towel XL Open' },
        ],
        category: bodyTowels._id,
        stock: 90,
        rating: 4.5,
        numReviews: 27,
        highlights: ['Extra-large size for full body', '30 towels per box', 'Ultra-thick and absorbent'],
        uses: ['Post-shower drying', 'Gym and sports', 'Spa days at home'],
      },
      {
        name: 'Cleansing Headband',
        description: 'Soft, adjustable skincare headband to keep hair back during your routine. Spa-quality comfort.',
        price: 4,
        compareAtPrice: 6,
        discount: 33,
        prices: { JOD: 4, EGP: 54 },
        images: [
          { url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop', alt: 'Cleansing Headband' },
          { url: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&h=600&fit=crop', alt: 'Headband in Use' },
        ],
        category: accessories._id,
        stock: 200,
        rating: 4.4,
        numReviews: 38,
        highlights: ['Soft microfiber material', 'Adjustable velcro closure', 'Machine washable'],
        uses: ['Skincare routines', 'Makeup application', 'Face washing'],
      },
      {
        name: 'Complete Skincare Set',
        description: 'Everything you need for the perfect skincare routine. Includes Face Towel, Golden Towel, Travel Pack, and Headband.',
        price: 35,
        compareAtPrice: 47,
        discount: 26,
        prices: { JOD: 35, EGP: 473 },
        images: [
          { url: 'https://images.unsplash.com/photo-1556228578-626e9590b81b?w=600&h=600&fit=crop', alt: 'Complete Set' },
          { url: 'https://images.unsplash.com/photo-1556229010-aa3f7ff66b24?w=600&h=600&fit=crop', alt: 'Set Contents' },
        ],
        category: bundles._id,
        isBundle: true,
        stock: 50,
        rating: 5.0,
        numReviews: 19,
        highlights: ['4 products in 1 set', 'Save 26% vs buying separately', 'Perfect gift option'],
        uses: ['Complete skincare upgrade', 'Gifting', 'Trying all products'],
      },
    ]);

    // ========================
    // 4. Create Coupons
    // ========================
    console.log('🎟️  Creating coupons...');
    await Coupon.create([
      {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minPurchase: 15,
        maxDiscount: 10,
        usageLimit: 100,
        expiresAt: new Date('2027-12-31'),
      },
      {
        code: 'SAVE5',
        type: 'fixed',
        value: 5,
        minPurchase: 25,
        usageLimit: 50,
        expiresAt: new Date('2027-06-30'),
      },
      {
        code: 'BUNDLE20',
        type: 'percentage',
        value: 20,
        minPurchase: 30,
        maxDiscount: 15,
        usageLimit: 30,
        expiresAt: new Date('2027-03-31'),
      },
    ]);

    // ========================
    // 5. Create Sample Expenses
    // ========================
    console.log('💰 Creating expenses...');
    await Expense.create([
      { title: 'Towel Inventory Restock', amount: 2500, currency: 'JOD', category: 'inventory', description: 'Monthly towel inventory purchase', date: new Date('2026-04-01'), createdBy: admin._id },
      { title: 'Facebook Ads - April', amount: 800, currency: 'JOD', category: 'marketing', description: 'Facebook & Instagram ad campaigns', date: new Date('2026-04-05'), createdBy: admin._id },
      { title: 'Shipping Costs - March', amount: 350, currency: 'JOD', category: 'shipping', description: 'Courier service monthly invoice', date: new Date('2026-03-28'), createdBy: admin._id },
      { title: 'Warehouse Rent', amount: 600, currency: 'JOD', category: 'operations', description: 'Monthly warehouse rent', date: new Date('2026-04-01'), createdBy: admin._id },
      { title: 'Staff Salaries - April', amount: 3000, currency: 'JOD', category: 'salaries', description: 'Monthly payroll', date: new Date('2026-04-01'), createdBy: admin._id },
      { title: 'Electricity Bill', amount: 120, currency: 'JOD', category: 'utilities', description: 'Warehouse electricity', date: new Date('2026-04-10'), createdBy: admin._id },
      { title: 'Packaging Materials', amount: 450, currency: 'JOD', category: 'inventory', description: 'Boxes, wrapping, and labels', date: new Date('2026-04-08'), createdBy: admin._id },
      { title: 'Google Ads - April', amount: 500, currency: 'JOD', category: 'marketing', description: 'Google search and shopping ads', date: new Date('2026-04-07'), createdBy: admin._id },
      { title: 'Domain & Hosting', amount: 25, currency: 'JOD', category: 'operations', description: 'Annual domain and hosting renewal', date: new Date('2026-03-15'), createdBy: admin._id },
      { title: 'Product Photography', amount: 200, currency: 'JOD', category: 'marketing', description: 'Professional product shoots', date: new Date('2026-03-20'), createdBy: admin._id },
    ]);

    console.log('\n✅ Seed completed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin: admin@haithamstore.com / admin123');
    console.log('📧 User:  john@test.com / user123');
    console.log(`📦 Products: ${products.length}`);
    console.log('🎟️  Coupons: WELCOME10, SAVE5, BUNDLE20');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();

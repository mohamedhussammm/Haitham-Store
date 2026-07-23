const mongoose = require('mongoose');
require('dotenv').config();

const User     = require('../models/User');
const Category = require('../models/Category');
const Product  = require('../models/Product');
const Coupon   = require('../models/Coupon');
const Expense  = require('../models/Expense');

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
    // 1. Admin & Test Users
    // ========================
    console.log('👤 Creating users...');
    const admin = await User.create({
      firstName: 'Fit Station',
      lastName:  'Admin',
      email:     'admin@fitstation.com',
      password:  'admin123',
      role:      'admin',
      phone:     '01113395716',
    });

    await User.create({
      firstName: 'Ahmed',
      lastName:  'Hassan',
      email:     'ahmed@test.com',
      password:  'user123',
      role:      'user',
      phone:     '01000000000',
    });

    // ========================
    // 2. Food Categories
    // ========================
    console.log('📁 Creating categories...');
    const categories = await Category.create([
      { name: 'Protein Meals',      description: 'High-protein meal boxes with rice & vegetables — fuel your goals' },
      { name: 'Salads',             description: 'Fresh daily salads — clean, light, and packed with nutrients' },
      { name: 'Meal Plans',         description: 'Weekly & monthly subscription meal plans — customized for your diet' },
      { name: 'Snacks',             description: 'Healthy snacks and light bites to keep you on track' },
      { name: 'Juices & Smoothies', description: 'Cold-pressed juices and protein smoothies — fresh every day' },
    ]);

    const [proteinMeals, salads, mealPlans, snacks, juices] = categories;

    // ========================
    // 3. Meals (from brand assets)
    // ========================
    console.log('🥗 Creating meals...');

    // Realistic food images from Unsplash — meal prep container style
    const meals = await Product.create([
      // ── PROTEIN MEALS ────────────────────────────────────────────────
      {
        name:        'Chicken Sweet and Sour',
        description: 'Tender chicken pieces tossed in a tangy sweet and sour sauce, served with steamed white rice and a side of sautéed vegetables. Clean fuel with bold flavor — every bite is calorie-smart.',
        highlights:  ['High Protein', 'Calorie Counted', 'Fresh Ingredients', 'Cooked to Perfection'],
        nutrition:   { calories: 460, protein: 39, carbs: 52, fat: 9, fiber: 4, sugar: 8 },
        dietaryTags: ['high-protein', 'halal', 'low-fat'],
        allergens:   ['soy'],
        ingredients: ['Chicken breast', 'White rice', 'Bell peppers', 'Pineapple chunks', 'Sweet and sour sauce', 'Peas', 'Carrots', 'Spring onion'],
        portionSize: '450g',
        planCadence: 'one-off',
        price:       129,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 129 },
        images: [
          { url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=600&fit=crop', alt: 'Chicken Sweet and Sour meal box' },
          { url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=600&fit=crop', alt: 'Chicken Sweet and Sour close up' },
        ],
        category:    proteinMeals._id,
        stock:       50,
        rating:      4.9,
        numReviews:  124,
        seo: {
          metaTitle:       'Chicken Sweet and Sour | Fit Station Kitchen',
          metaDescription: '39g protein, 460 kcal. Tender chicken in tangy sweet and sour sauce with rice & veggies.',
        },
      },
      {
        name:        'Chicken Barbecue',
        description: 'Smoky grilled chicken barbecue with a perfectly balanced BBQ glaze, served on a bed of fluffy white rice with sautéed seasonal vegetables. Healthy never tasted this good.',
        highlights:  ['High Protein', 'Fresh Ingredients', 'Grilled to Perfection', 'Calorie Counted'],
        nutrition:   { calories: 480, protein: 40, carbs: 55, fat: 12, fiber: 3, sugar: 10 },
        dietaryTags: ['high-protein', 'halal'],
        allergens:   [],
        ingredients: ['Chicken breast', 'White rice', 'BBQ sauce', 'Bell peppers', 'Peas', 'Corn', 'Garlic', 'Olive oil'],
        portionSize: '470g',
        planCadence: 'one-off',
        price:       129,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 129 },
        images: [
          { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop', alt: 'Chicken Barbecue meal box' },
          { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', alt: 'Grilled Chicken BBQ' },
        ],
        category:    proteinMeals._id,
        stock:       50,
        rating:      4.9,
        numReviews:  98,
        seo: {
          metaTitle:       'Chicken Barbecue | Fit Station Kitchen',
          metaDescription: '40g protein, 480 kcal. Smoky grilled BBQ chicken with rice & vegetables.',
        },
      },
      {
        name:        'Chicken Sweet Corn',
        description: 'Creamy chicken with sweet corn and mixed vegetables in a rich, light sauce — served with a fresh cucumber and mixed vegetable side. Customize it to fit your diet plan.',
        highlights:  ['Extra Protein', 'Fresh Ingredients', 'Customize Your Meal', 'Real Food, Real Results'],
        nutrition:   { calories: 450, protein: 38, carbs: 48, fat: 10, fiber: 5, sugar: 6 },
        dietaryTags: ['high-protein', 'halal', 'gluten-free'],
        allergens:   ['dairy'],
        ingredients: ['Chicken breast', 'Sweet corn', 'Cucumber', 'Bell peppers', 'Peas', 'Light cream sauce', 'Fresh herbs'],
        portionSize: '430g',
        planCadence: 'one-off',
        price:       129,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 129 },
        images: [
          { url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=600&fit=crop', alt: 'Chicken Sweet Corn meal box' },
          { url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&h=600&fit=crop', alt: 'Chicken Sweet Corn top view' },
        ],
        category:    proteinMeals._id,
        stock:       45,
        rating:      4.8,
        numReviews:  77,
        seo: {
          metaTitle:       'Chicken Sweet Corn | Fit Station Kitchen',
          metaDescription: '38g protein, 450 kcal. Creamy chicken sweet corn with fresh veggie side.',
        },
      },
      {
        name:        'Meatballs with Red Sauce',
        description: 'Hearty beef and herb meatballs slow-cooked in a rich tomato red sauce, served with a fresh cucumber and sautéed vegetable side. Extra protein, real results.',
        highlights:  ['Extra Protein', 'Fresh Ingredients', 'Customize Your Meal', 'Slow Cooked'],
        nutrition:   { calories: 420, protein: 35, carbs: 30, fat: 14, fiber: 4, sugar: 5 },
        dietaryTags: ['high-protein', 'halal', 'low-carb'],
        allergens:   ['gluten'],
        ingredients: ['Beef mince', 'Tomato sauce', 'Onion', 'Garlic', 'Fresh herbs', 'Cucumber', 'Bell peppers', 'Peas'],
        portionSize: '440g',
        planCadence: 'one-off',
        price:       139,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 139 },
        images: [
          { url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&h=600&fit=crop', alt: 'Meatballs with Red Sauce meal box' },
          { url: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=600&fit=crop', alt: 'Meatballs close up' },
        ],
        category:    proteinMeals._id,
        stock:       40,
        rating:      4.8,
        numReviews:  65,
        seo: {
          metaTitle:       'Meatballs with Red Sauce | Fit Station Kitchen',
          metaDescription: '35g protein, 420 kcal. Hearty meatballs in rich tomato sauce with fresh veggie side.',
        },
      },

      // ── SALADS ───────────────────────────────────────────────────────
      {
        name:        'Fresh Fit Salad Box',
        description: 'The best salad in town — mixed greens, ripe tomatoes, crisp cucumber, red onion, fresh lime, and colourful bell peppers. Clean, tasty, and 100% fresh every day. Eat Clean. Feel Unstoppable.',
        highlights:  ['Fresh Ingredients', 'Tasty & Light', 'Healthy Choice', 'Boosts Your Day'],
        nutrition:   { calories: 150, protein: 8, carbs: 18, fat: 5, fiber: 6, sugar: 7 },
        dietaryTags: ['vegan', 'gluten-free', 'low-carb', 'low-fat', 'high-fiber'],
        allergens:   [],
        ingredients: ['Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Red onion', 'Fresh lime', 'Yellow bell pepper', 'Red bell pepper', 'Olive oil dressing'],
        portionSize: '300g',
        planCadence: 'one-off',
        price:       89,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 89 },
        images: [
          { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=600&fit=crop', alt: 'Fresh Fit Salad Box' },
          { url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&h=600&fit=crop', alt: 'Fresh Salad Close Up' },
        ],
        category:    salads._id,
        stock:       80,
        rating:      4.9,
        numReviews:  142,
        seo: {
          metaTitle:       'Fresh Fit Salad Box | Fit Station Kitchen',
          metaDescription: 'Best salad in town! 8g protein, 150 kcal. Fresh greens, tomato, cucumber, lime & peppers.',
        },
      },
      {
        name:        'Protein Power Salad',
        description: 'Grilled chicken strips over a bed of mixed greens, cherry tomatoes, cucumber, and a light lemon-tahini drizzle. The ultimate clean-fuel salad for serious fitness goals.',
        highlights:  ['High Protein', 'Fresh Daily', 'Clean Fuel', 'Gluten Free'],
        nutrition:   { calories: 280, protein: 32, carbs: 14, fat: 9, fiber: 5, sugar: 4 },
        dietaryTags: ['high-protein', 'halal', 'gluten-free', 'low-carb'],
        allergens:   ['sesame'],
        ingredients: ['Grilled chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Lemon-tahini dressing', 'Sesame seeds'],
        portionSize: '380g',
        planCadence: 'one-off',
        price:       99,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 99 },
        images: [
          { url: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=600&fit=crop', alt: 'Protein Power Salad' },
          { url: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=600&h=600&fit=crop', alt: 'Grilled Chicken Salad' },
        ],
        category:    salads._id,
        stock:       60,
        rating:      4.8,
        numReviews:  58,
      },

      // ── MEAL PLANS (BUNDLES / SUBSCRIPTIONS) ────────────────────────
      {
        name:        '5-Day Lean Plan — Weekly',
        description: 'Five perfectly calorie-counted meals delivered across the week. Pick your protein, customize your macros, and let us do the meal prep. Real food, real results — The Fit Station Way.',
        highlights:  ['5 Protein Meals', 'Customized to Your Macros', 'Weekly Delivery', 'Save 15%'],
        nutrition:   { calories: 460, protein: 39, carbs: 50, fat: 10, fiber: 4, sugar: 7 },
        dietaryTags: ['high-protein', 'halal'],
        allergens:   [],
        ingredients: [],
        portionSize: '5 meals / week',
        planCadence: 'weekly',
        price:       549,
        compareAtPrice: 645,
        discount:    15,
        currency:    'EGP',
        prices:      { EGP: 549 },
        images: [
          { url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=600&fit=crop', alt: '5-Day Lean Plan meal prep' },
          { url: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600&h=600&fit=crop', alt: 'Weekly meal boxes' },
        ],
        category:    mealPlans._id,
        isBundle:    true,
        stock:       30,
        rating:      4.9,
        numReviews:  47,
        seo: {
          metaTitle:       '5-Day Lean Plan | Fit Station Kitchen',
          metaDescription: 'Weekly subscription — 5 high-protein calorie-counted meals. Customize your macros. Save 15%.',
        },
      },
      {
        name:        '4-Week Transformation Plan — Monthly',
        description: '20 calorie-counted, high-protein meals across 4 weeks — fully customized to your diet plan and fitness goals. The most comprehensive meal plan we offer. Eat Fit. Live Strong.',
        highlights:  ['20 Meals over 4 Weeks', 'Fully Customizable', 'Monthly Delivery', 'Save 20%'],
        nutrition:   { calories: 460, protein: 39, carbs: 50, fat: 10, fiber: 4, sugar: 7 },
        dietaryTags: ['high-protein', 'halal'],
        allergens:   [],
        ingredients: [],
        portionSize: '20 meals / month',
        planCadence: 'monthly',
        price:       1999,
        compareAtPrice: 2580,
        discount:    22,
        currency:    'EGP',
        prices:      { EGP: 1999 },
        images: [
          { url: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&h=600&fit=crop', alt: '4-Week Transformation Plan' },
          { url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=600&fit=crop', alt: 'Monthly meal plan boxes' },
        ],
        category:    mealPlans._id,
        isBundle:    true,
        stock:       20,
        rating:      5.0,
        numReviews:  23,
        seo: {
          metaTitle:       '4-Week Transformation Plan | Fit Station Kitchen',
          metaDescription: 'Monthly subscription — 20 meals fully customized to your diet plan. Save 22%.',
        },
      },
      {
        name:        '3-Day Trial Pack',
        description: 'Not sure where to start? Try Fit Station with our 3-day starter pack — 3 handpicked protein meals to taste the quality before committing to a full plan.',
        highlights:  ['3 Protein Meals', 'Perfect Starter', 'No Commitment', 'Full Macros Info'],
        nutrition:   { calories: 460, protein: 39, carbs: 50, fat: 10, fiber: 4, sugar: 7 },
        dietaryTags: ['high-protein', 'halal'],
        allergens:   [],
        ingredients: [],
        portionSize: '3 meals',
        planCadence: 'one-off',
        price:       349,
        compareAtPrice: 387,
        discount:    10,
        currency:    'EGP',
        prices:      { EGP: 349 },
        images: [
          { url: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&h=600&fit=crop', alt: '3-Day Trial Pack' },
          { url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop', alt: '3-Day Trial Pack box' },
        ],
        category:    mealPlans._id,
        isBundle:    true,
        stock:       50,
        rating:      4.8,
        numReviews:  31,
      },

      // ── SNACKS ───────────────────────────────────────────────────────
      {
        name:        'Protein Energy Balls',
        description: 'Handcrafted oat, nut butter, and dark chocolate protein energy balls. A clean, satisfying snack with zero guilt. 6 balls per box.',
        highlights:  ['Natural Ingredients', 'No Added Sugar', 'High Protein Snack', '6 per box'],
        nutrition:   { calories: 210, protein: 12, carbs: 22, fat: 8, fiber: 3, sugar: 5 },
        dietaryTags: ['vegetarian', 'high-protein', 'high-fiber'],
        allergens:   ['nuts', 'gluten'],
        ingredients: ['Oats', 'Peanut butter', 'Dark chocolate chips', 'Honey', 'Vanilla extract', 'Chia seeds'],
        portionSize: '6 balls / 120g',
        planCadence: 'one-off',
        price:       59,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 59 },
        images: [
          { url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=600&h=600&fit=crop', alt: 'Protein Energy Balls' },
          { url: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=600&h=600&fit=crop', alt: 'Protein Energy Balls prep' },
        ],
        category:    snacks._id,
        stock:       100,
        rating:      4.7,
        numReviews:  39,
      },

      // ── JUICES & SMOOTHIES ──────────────────────────────────────────
      {
        name:        'Green Power Juice',
        description: 'Cold-pressed spinach, cucumber, green apple, ginger, and lemon. Packed with micronutrients to boost your energy and kickstart your day the clean way.',
        highlights:  ['Cold Pressed', 'No Added Sugar', 'Vitamin Rich', '100% Natural'],
        nutrition:   { calories: 95, protein: 3, carbs: 22, fat: 0, fiber: 3, sugar: 14 },
        dietaryTags: ['vegan', 'gluten-free', 'low-fat', 'low-carb'],
        allergens:   [],
        ingredients: ['Spinach', 'Cucumber', 'Green apple', 'Ginger', 'Lemon', 'Cold water'],
        portionSize: '350ml',
        planCadence: 'one-off',
        price:       49,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 49 },
        images: [
          { url: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&h=600&fit=crop', alt: 'Green Power Juice' },
          { url: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b7?w=600&h=600&fit=crop', alt: 'Green Power Juice glass' },
        ],
        category:    juices._id,
        stock:       80,
        rating:      4.8,
        numReviews:  52,
      },
      {
        name:        'Protein Mango Smoothie',
        description: 'Thick and creamy mango smoothie with whey protein, banana, and low-fat milk. The perfect post-workout recovery drink — sweet, satisfying, and macro-friendly.',
        highlights:  ['Post-Workout', 'High Protein', 'Natural Mango', 'No Artificial Flavours'],
        nutrition:   { calories: 280, protein: 25, carbs: 38, fat: 4, fiber: 2, sugar: 28 },
        dietaryTags: ['high-protein', 'halal', 'vegetarian'],
        allergens:   ['dairy'],
        ingredients: ['Mango', 'Banana', 'Whey protein', 'Low-fat milk', 'Honey'],
        portionSize: '400ml',
        planCadence: 'one-off',
        price:       59,
        compareAtPrice: null,
        discount:    0,
        currency:    'EGP',
        prices:      { EGP: 59 },
        images: [
          { url: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=600&fit=crop', alt: 'Protein Mango Smoothie' },
          { url: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=600&fit=crop', alt: 'Protein Mango Smoothie close up' },
        ],
        category:    juices._id,
        stock:       70,
        rating:      4.9,
        numReviews:  44,
      },
    ]);

    // ========================
    // 4. Coupons
    // ========================
    console.log('🎟️  Creating coupons...');
    await Coupon.create([
      {
        code:        'FITSTART10',
        type:        'percentage',
        value:       10,
        minPurchase: 100,
        maxDiscount: 50,
        usageLimit:  200,
        expiresAt:   new Date('2027-12-31'),
      },
      {
        code:        'EATFIT',
        type:        'fixed',
        value:       30,
        minPurchase: 200,
        usageLimit:  100,
        expiresAt:   new Date('2027-06-30'),
      },
      {
        code:        'MEALPLAN20',
        type:        'percentage',
        value:       20,
        minPurchase: 500,
        maxDiscount: 200,
        usageLimit:  50,
        expiresAt:   new Date('2027-03-31'),
      },
    ]);

    // ========================
    // 5. Expenses
    // ========================
    console.log('💰 Creating expenses...');
    await Expense.create([
      { title: 'Ingredient Procurement — July', amount: 18500, currency: 'EGP', category: 'inventory',   description: 'Monthly fresh ingredient purchase (chicken, vegetables, rice)', date: new Date('2026-07-01'), createdBy: admin._id },
      { title: 'Facebook & Instagram Ads',       amount: 6000,  currency: 'EGP', category: 'marketing',  description: 'Social media ad campaigns for July', date: new Date('2026-07-05'), createdBy: admin._id },
      { title: 'Delivery Courier Service',       amount: 3200,  currency: 'EGP', category: 'shipping',   description: 'Monthly delivery partner invoice', date: new Date('2026-06-28'), createdBy: admin._id },
      { title: 'Kitchen Rent — July',            amount: 8000,  currency: 'EGP', category: 'operations', description: 'Monthly commercial kitchen rental', date: new Date('2026-07-01'), createdBy: admin._id },
      { title: 'Staff Salaries — July',          amount: 22000, currency: 'EGP', category: 'salaries',   description: 'Kitchen and delivery staff payroll', date: new Date('2026-07-01'), createdBy: admin._id },
      { title: 'Gas & Electricity',              amount: 950,   currency: 'EGP', category: 'utilities',  description: 'Kitchen utilities bill', date: new Date('2026-07-10'), createdBy: admin._id },
      { title: 'Meal Containers & Packaging',    amount: 3500,  currency: 'EGP', category: 'inventory',  description: 'Black 2-compartment meal prep containers, labels, and bags', date: new Date('2026-07-08'), createdBy: admin._id },
      { title: 'Content Creation & Photography', amount: 2000,  currency: 'EGP', category: 'marketing',  description: 'Meal photography and social media content', date: new Date('2026-06-20'), createdBy: admin._id },
      { title: 'Website & Hosting',              amount: 300,   currency: 'EGP', category: 'operations', description: 'Monthly hosting and domain', date: new Date('2026-07-15'), createdBy: admin._id },
      { title: 'TikTok Ads — June',             amount: 4500,  currency: 'EGP', category: 'marketing',  description: 'TikTok performance ad campaign', date: new Date('2026-06-07'), createdBy: admin._id },
    ]);

    console.log('\n✅ Fit Station seed completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin:  admin@fitstation.com / admin123');
    console.log('📧 User:   ahmed@test.com / user123');
    console.log(`🥗 Meals:  ${meals.length}`);
    console.log('🎟️  Coupons: FITSTART10, EATFIT, MEALPLAN20');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedData();

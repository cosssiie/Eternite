require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const CategoryTemplate = require('../models/CategoryTemplate');
const Publication = require('../models/Publication');

const seed = async () => {
    await connectDB();

    await User.deleteMany();
    await Category.deleteMany();
    await CategoryTemplate.deleteMany();
    await Publication.deleteMany();
    console.log('✅ Колекції очищено');

    // ─── USERS ───────────────────────────────────────────
    const users = await User.insertMany([
        {
            name: 'Admin',
            email: 'admin@test.com',
            password: await bcrypt.hash('admin123', 10),
            role: 'admin',
            isActive: true,
            verifyToken: null,
            favourites: [],
        },
        {
            name: 'John Doe',
            email: 'john@test.com',
            password: await bcrypt.hash('user123', 10),
            role: 'user',
            isActive: true,
            verifyToken: null,
            favourites: [],
        },
        {
            name: 'Oliver',
            email: 'oliv01@test.com',
            password: await bcrypt.hash('qwerty', 10),
            role: 'user',
            isActive: true,
            verifyToken: null,
            favourites: [],
        },
        {
            name: 'Kamilla Antique',
            email: 'kamilla_123@test.com',
            password: await bcrypt.hash('hello', 10),
            role: 'user',
            isActive: true,
            verifyToken: null,
            favourites: [],
        },
        {
            name: 'Elizabeth',
            email: 'lis_lis@test.com',
            password: await bcrypt.hash('1234', 10),
            role: 'user',
            isActive: true,
            verifyToken: null,
            favourites: [],
        },
    ]);
    console.log('✅ Користувачів створено');

    // ─── ROOT CATEGORIES ─────────────────────────────────
    const [
        catClothing,
        catArt,
        catFurniture,
        catHomeDecor,
        catKitchen,
        catLighting,
        catRugs,
    ] = await Category.insertMany([
        { name: 'Clothing', parent: null, isActive: true },
        { name: 'Art', parent: null, isActive: true },
        { name: 'Furniture', parent: null, isActive: true },
        { name: 'Home Decor', parent: null, isActive: true },
        { name: 'Kitchen And Bar', parent: null, isActive: true },
        { name: 'Lighting', parent: null, isActive: true },
        { name: 'Rugs', parent: null, isActive: true },
    ]);
    console.log('✅ Кореневі категорії створено');

    // ─── SUBCATEGORIES ────────────────────────────────────
    const [
        // Clothing
        catAccessories,
        catOuterwear,
        catDresses,
        catShirts,
        catFootwear,
        // Art
        catPaintings,
        catMosaic,
        catSculpture,
        catPrints,
        // Furniture
        catChairs,
        catTables,
        catCabinets,
        catSofas,
        // Home Decor
        catVases,
        catClocks,
        catMirrors,
        // Kitchen And Bar
        catCutlery,
        catGlassware,
        catCeramics,
        // Lighting
        catChandeliers,
        catLamps,
        // Rugs
        catOrientalRugs,
        catTapestries,
    ] = await Category.insertMany([
        // Clothing
        { name: 'Accessories', parent: catClothing._id, isActive: true },
        { name: 'Outerwear', parent: catClothing._id, isActive: true },
        { name: 'Dresses', parent: catClothing._id, isActive: true },
        { name: 'Shirts', parent: catClothing._id, isActive: true },
        { name: 'Footwear', parent: catClothing._id, isActive: true },
        // Art
        { name: 'Paintings', parent: catArt._id, isActive: true },
        { name: 'Mosaic', parent: catArt._id, isActive: true },
        { name: 'Sculpture', parent: catArt._id, isActive: true },
        { name: 'Prints', parent: catArt._id, isActive: true },
        // Furniture
        { name: 'Chairs', parent: catFurniture._id, isActive: true },
        { name: 'Tables', parent: catFurniture._id, isActive: true },
        { name: 'Cabinets', parent: catFurniture._id, isActive: true },
        { name: 'Sofas', parent: catFurniture._id, isActive: true },
        // Home Decor
        { name: 'Vases', parent: catHomeDecor._id, isActive: true },
        { name: 'Clocks', parent: catHomeDecor._id, isActive: true },
        { name: 'Mirrors', parent: catHomeDecor._id, isActive: true },
        // Kitchen And Bar
        { name: 'Cutlery', parent: catKitchen._id, isActive: true },
        { name: 'Glassware', parent: catKitchen._id, isActive: true },
        { name: 'Ceramics', parent: catKitchen._id, isActive: true },
        // Lighting
        { name: 'Chandeliers', parent: catLighting._id, isActive: true },
        { name: 'Lamps', parent: catLighting._id, isActive: true },
        // Rugs
        { name: 'Oriental Rugs', parent: catRugs._id, isActive: true },
        { name: 'Tapestries', parent: catRugs._id, isActive: true },
    ]);
    console.log('✅ Підкатегорії створено');

    // ─── TEMPLATES ────────────────────────────────────────
    await CategoryTemplate.insertMany([
        {
            category: catAccessories._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                {
                    key: 'condition', label: 'Condition', type: 'select', required: true,
                    options: ['Excellent', 'Good', 'Fair', 'Needs restoration']
                },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'origin', label: 'Country of origin', type: 'text' },
            ],
        },
        {
            category: catOuterwear._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                {
                    key: 'condition', label: 'Condition', type: 'select', required: true,
                    options: ['Excellent', 'Good', 'Fair']
                },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'style', label: 'Era style', type: 'text' },
            ],
        },
        {
            category: catDresses._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                {
                    key: 'condition', label: 'Condition', type: 'select', required: true,
                    options: ['Excellent', 'Good', 'Fair']
                },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'style', label: 'Era style', type: 'text' },
            ],
        },
        {
            category: catShirts._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                {
                    key: 'condition', label: 'Condition', type: 'select', required: true,
                    options: ['Excellent', 'Good', 'Fair']
                },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'style', label: 'Era style', type: 'text' },
            ],
        },
        {
            category: catFootwear._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                {
                    key: 'condition', label: 'Condition', type: 'select', required: true,
                    options: ['Excellent', 'Good', 'Fair']
                },
                { key: 'size', label: 'Size', type: 'number' },
                { key: 'material', label: 'Material', type: 'text' },
            ],
        },
        {
            category: catPaintings._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'epoch', label: 'Epoch', type: 'text', required: true },
                {
                    key: 'technique', label: 'Technique', type: 'select',
                    options: ['Oil', 'Watercolour', 'Tempera', 'Pastel', 'Graphics', 'Another']
                },
                { key: 'size', label: 'Size (cm)', type: 'text' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Restored']
                },
                { key: 'school', label: 'Art school', type: 'text' },
            ],
        },
        {
            category: catMosaic._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'epoch', label: 'Epoch', type: 'text' },
                {
                    key: 'material', label: 'Material', type: 'select',
                    options: ['Glass', 'Stone', 'Ceramic', 'Mixed media', 'Another']
                },
                { key: 'size', label: 'Size (cm)', type: 'text' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Fragmentary']
                },
            ],
        },
        {
            category: catSculpture._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'epoch', label: 'Epoch', type: 'text' },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'height', label: 'Height (cm)', type: 'number' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Needs restoration']
                },
            ],
        },
        {
            category: catChairs._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'style', label: 'Style', type: 'text', },
                { key: 'material', label: 'Material', type: 'text' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Needs restoration', 'Another']
                },
                { key: 'origin', label: 'Country of origin', type: 'text' },
            ],
        },
        {
            category: catTables._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                {
                    key: 'style', label: 'Style', type: 'select',
                    options: ['Baroque', 'Classicism', 'Empire', 'Art Nouveau', 'Another']
                },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'size', label: 'Size (cm)', type: 'text' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Needs restoration']
                },
            ],
        },
        {
            category: catVases._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'origin', label: 'Country of origin', type: 'text' },
                {
                    key: 'material', label: 'Material', type: 'select',
                    options: ['Porcelain', 'Ceramic', 'Glass', 'Bronze', 'Another']
                },
                { key: 'height', label: 'Height (cm)', type: 'number' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Has cracks']
                },
            ],
        },
        {
            category: catClocks._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'origin', label: 'Country of origin', type: 'text' },
                { key: 'material', label: 'Material', type: 'text' },
                {
                    key: 'working', label: 'Working', type: 'select',
                    options: ['Yes', 'No', 'Needs repair']
                },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Fair']
                },
            ],
        },
        {
            category: catChandeliers._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'style', label: 'Style', type: 'text' },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'size', label: 'Size (cm)', type: 'text' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Needs restoration']
                },
            ],
        },
        {
            category: catOrientalRugs._id,
            fields: [
                { key: 'year', label: 'Year', type: 'number', required: true },
                { key: 'origin', label: 'Country of origin', type: 'text' },
                { key: 'material', label: 'Material', type: 'text' },
                { key: 'size', label: 'Size (cm)', type: 'text' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Fair']
                },
            ],
        },
    ]);
    console.log('✅ Шаблони створено');

    // ─── PUBLICATIONS ─────────────────────────────────────
    const publications = await Publication.insertMany([
        {
            title: 'Victorian Button-Back Floral Armchair',
            description: 'Elegant mid-19th century armchair with deep tufting and floral upholstery',
            content: 'A classic Victorian piece featuring intricate blue floral chintz fabric. The chair is distinguished by its deep button-tufted backrest and rare ornate gilded front legs with original brass casters.',
            images: [
                '/uploads/19th-century-country-house-armchair.jpg',
                '/uploads/19th-century-country-house-armchair-front.jpg',
                '/uploads/19th-century-country-house-armchair-back.jpg',
                '/uploads/19th-century-country-house-armchair-details.jpg'
            ],
            author: users[2]._id,
            category: catChairs._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1865' },
                { key: 'style', label: 'Style', value: 'Victorian' },
                { key: 'material', label: 'Material', value: 'Gilded wood, Chintz fabric' },
                { key: 'condition', label: 'Condition', value: 'Excellent' },
                { key: 'origin', label: 'Country of origin', value: 'United Kingdom' },
            ],
        },
        {
            title: 'Classic Crimson Velvet Armchair',
            description: 'Rich Victorian-era tufted armchair in vibrant red velvet',
            content: 'A quintessentially comfortable Victorian armchair with a high tufted back and rolled arms. Supported by finely turned mahogany legs on brass casters, upholstered in a high-quality crimson velvet.',
            images: [
                '/uploads/19th-century-red-velvet-armchair.jpg',
                '/uploads/19th-century-red-velvet-armchair-front.jpg',
                '/uploads/19th-century-red-velvet-armchair-back.jpg',
                '/uploads/19th-century-red-velvet-armchair-details.jpg'
            ],
            author: users[1]._id,
            category: catChairs._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1880' },
                { key: 'style', label: 'Style', value: 'Late Victorian' },
                { key: 'material', label: 'Material', value: 'Mahogany, Velvet' },
                { key: 'condition', label: 'Condition', value: 'Good' },
                { key: 'origin', label: 'Country of origin', value: 'United Kingdom' },
            ],
        },
        {
            title: 'Antique Restoration Project Armchair',
            description: 'Mid-19th century armchair frame showcasing authentic internal construction',
            content: 'A rare opportunity for collectors or restorers. This piece reveals original horsehair stuffing and burlap layers, retaining portions of its authentic blue damask fabric. Features ebonized front legs with brass caps.',
            images: [
                '/uploads/19th-century-armchair.jpg',
                '/uploads/19th-century-armchair-front.jpg',
                '/uploads/19th-century-armchair-back.jpg'
            ],
            author: users[3]._id,
            category: catChairs._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1850' },
                { key: 'style', label: 'Style', value: 'Early Victorian' },
                { key: 'material', label: 'Material', value: 'Wood, Horsehair, Damask' },
                { key: 'condition', label: 'Condition', value: 'Requires Restoration' },
                { key: 'origin', label: 'Country of origin', value: 'France' },
            ],
        },
        {
            title: 'Olive Velvet Button-Back Armchair',
            description: 'A charming Victorian tufted armchair in muted olive green velvet',
            content: 'This elegant low-profile armchair features deep button tufting and a distinctive decorative fringe along the base. Crafted during the mid-Victorian era, it sits on beautifully turned mahogany front legs and splayed rear legs, all retaining their original brass casters.',
            images: [
                '/uploads/19th-century-tub-back-armchair.jpg',
                '/uploads/19th-century-tub-back-armchair-front.jpg',
                '/uploads/19th-century-tub-back-armchair-back.jpg',
                '/uploads/19th-century-tub-back-armchair-details.jpg',
            ],
            author: users[4]._id,
            category: catChairs._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1875' },
                { key: 'style', label: 'Style', value: 'Victorian' },
                { key: 'material', label: 'Material', value: 'Mahogany, Velvet' },
                { key: 'condition', label: 'Condition', value: 'Good (Vintage patina)' },
                { key: 'origin', label: 'Country of origin', value: 'United Kingdom' },
            ],
        },
        {
            title: 'Ornate Mahogany Salon Armchair',
            description: 'Exquisite Rococo Revival armchair with intricate carvings and cream upholstery',
            content: 'A high-quality carved mahogany armchair featuring a hand-carved frame with floral cresting and scrolled armrests. The back is expertly button-tufted and upholstered in premium cream fabric, standing on graceful cabriole legs with original casters.',
            images: [
                '/uploads/antique-victorian-armchair.jpg',
                '/uploads/antique-victorian-armchair-front.jpg',
                '/uploads/antique-victorian-armchair-details.jpg',
                '/uploads/antique-victorian-armchair-back.jpg',
            ],
            author: users[3]._id,
            category: catChairs._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1890' },
                { key: 'style', label: 'Style', value: 'Rococo Revival' },
                { key: 'material', label: 'Material', value: 'Mahogany, Cotton-linen blend' },
                { key: 'condition', label: 'Condition', value: 'Excellent (Restored)' },
                { key: 'origin', label: 'Country of origin', value: 'France' },
            ],
        },
        {
            title: 'Victorian Double-Ended Velvet Sofa',
            description: 'Exquisite mid-19th century double-ended sofa in olive green velvet',
            content: 'An elegant Victorian chaise longue or "tête-à-tête" sofa featuring a distinctive double-ended design. The high backrests are expertly button-tufted in a rich olive green velvet, accented by a decorative golden rope trim. The solid mahogany frame is highlighted by a central carved motif and rests on delicate cabriole legs with original brass casters.',
            images: [
                '/uploads/antique-victorian-spoon-back-settee.jpg',
                '/uploads/antique-victorian-spoon-back-settee-back.jpg',
                '/uploads/antique-victorian-spoon-back-settee-details.jpg',
            ],
            author: users[4]._id,
            category: catSofas._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1860' },
                { key: 'style', label: 'Style', value: 'Victorian' },
                { key: 'material', label: 'Material', value: 'Mahogany, Velvet' },
                { key: 'condition', label: 'Condition', value: 'Excellent' },
                { key: 'origin', label: 'Country of origin', value: 'United Kingdom' },
            ],
        },
        {
            title: 'Regency Mahogany Tufted Settee',
            description: 'Luxurious Regency style settee with champagne crushed velvet upholstery',
            content: 'This masterful piece of furniture features a wide, deep button-tufted backrest providing both comfort and a classic aesthetic. Upholstered in a lustrous champagne crushed velvet, the settee is framed by beautifully carved mahogany scroll arms. It is supported by four robustly fluted mahogany legs finished with authentic brass cup casters.',
            images: [
                '/uploads/early-19th-century-william-iv-period-velvet-sofa.jpg',
                '/uploads/early-19th-century-william-iv-period-velvet-sofa-back.jpg',
                '/uploads/early-19th-century-william-iv-period-velvet-sofa-details.jpg',
            ],
            author: users[2]._id,
            category: catSofas._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1830' },
                { key: 'style', label: 'Style', value: 'Regency' },
                { key: 'material', label: 'Material', value: 'Mahogany, Crushed Velvet' },
                { key: 'condition', label: 'Condition', value: 'Very Good' },
                { key: 'origin', label: 'Country of origin', value: 'United Kingdom' },
            ],
        }
    ]);
    console.log('✅ Публікації створено');

    // ─── FAVOURITES ───────────────────────────────────────
    await User.findByIdAndUpdate(users[1]._id, {
        favourites: [
            publications[2]._id,
            publications[3]._id,
        ]
    });

    await User.findByIdAndUpdate(users[2]._id, {
        favourites: [
            publications[1]._id,
            publications[4]._id,
            publications[6]._id,
        ]
    });

    console.log('✅ Вибрані публікації додано');
    console.log('🎉 Наповнення БД завершено успішно!');
    process.exit();
};

seed().catch(err => {
    console.error('❌ Помилка:', err);
    process.exit(1);
});
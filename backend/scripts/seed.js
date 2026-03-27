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
            name: 'Jane Smith',
            email: 'jane@test.com',
            password: await bcrypt.hash('user123', 10),
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
                { key: 'size', label: 'Size', type: 'number'},
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
                {
                    key: 'style', label: 'Style', type: 'select',
                    options: ['Baroque', 'Classicism', 'Empire', 'Art Nouveau', 'Victorian', 'Another']
                },
                { key: 'material', label: 'Material', type: 'text' },
                {
                    key: 'condition', label: 'Condition', type: 'select',
                    options: ['Excellent', 'Good', 'Needs restoration']
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
            title: 'Victorian Lady\'s Hat, 1890',
            description: 'Exquisite Victorian lady\'s hat from the late 19th century',
            content: 'Crafted from French felt and adorned with silk ribbon and artificial flowers. Original shape and colour preserved.',
            image: 'uploads/hat.jpg',
            author: users[1]._id,
            category: catAccessories._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1890' },
                { key: 'condition', label: 'Condition', value: 'Good' },
                { key: 'material', label: 'Material', value: 'Felt' },
                { key: 'origin', label: 'Country of origin', value: 'France' },
            ],
        },
        {
            title: 'Victorian Era Jacket',
            description: 'Ladies Victorian jacket with original buttons',
            content: 'Tailored from natural dark blue wool. All original pearl buttons intact. Lining requires minor repair.',
            image: 'uploads/jacket.jpg',
            author: users[1]._id,
            category: catOuterwear._id,
            status: 'pending',
            attributes: [
                { key: 'year', label: 'Year', value: '1875' },
                { key: 'condition', label: 'Condition', value: 'Fair' },
                { key: 'material', label: 'Material', value: 'Wool' },
                { key: 'style', label: 'Era style', value: 'Victorian' },
            ],
        },
        {
            title: 'Landscape by Unknown Author, XIX c.',
            description: 'Oil landscape from the French school of painting',
            content: 'Painted in oils on canvas. Depicts a rural landscape with a river and trees. Restored in 2010.',
            image: 'uploads/painting.jpg',
            author: users[2]._id,
            category: catPaintings._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1860' },
                { key: 'epoch', label: 'Epoch', value: 'Romanticism' },
                { key: 'technique', label: 'Technique', value: 'Oil' },
                { key: 'size', label: 'Size (cm)', value: '60x80' },
                { key: 'condition', label: 'Condition', value: 'Restored' },
                { key: 'school', label: 'Art school', value: 'French' },
            ],
        },
        {
            title: 'Byzantine Mosaic Fragment',
            description: 'Fragment of Byzantine mosaic in glass smalt',
            content: 'Unique fragment of a 10th century Byzantine mosaic. Made from gold and blue glass smalt. Depicts an ornamental fragment.',
            image: 'uploads/mosaic.jpg',
            author: users[0]._id,
            category: catMosaic._id,
            status: 'rejected',
            moderationComment: 'Insufficient information about the provenance of the item',
            attributes: [
                { key: 'year', label: 'Year', value: '900' },
                { key: 'epoch', label: 'Epoch', value: 'Byzantine' },
                { key: 'material', label: 'Material', value: 'Glass' },
                { key: 'size', label: 'Size (cm)', value: '30x30' },
                { key: 'condition', label: 'Condition', value: 'Fragmentary' },
            ],
        },
        {
            title: 'Empire Style Armchair',
            description: 'Luxurious early 19th century armchair in Empire style',
            content: 'Crafted from walnut wood with gilded details. Upholstery replaced with authentic period fabric.',
            image: 'uploads/chair.jpg',
            author: users[1]._id,
            category: catChairs._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1815' },
                { key: 'style', label: 'Style', value: 'Empire' },
                { key: 'material', label: 'Material', value: 'Walnut, gilding' },
                { key: 'condition', label: 'Condition', value: 'Good' },
                { key: 'origin', label: 'Country of origin', value: 'France' },
            ],
        },
        {
            title: 'Chinese Ming Dynasty Vase',
            description: 'Rare porcelain vase from the Ming Dynasty period',
            content: 'Hand-painted porcelain vase with traditional blue and white patterns. Minor hairline crack on base.',
            image: 'uploads/vase.jpg',
            author: users[2]._id,
            category: catVases._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1420' },
                { key: 'origin', label: 'Country of origin', value: 'China' },
                { key: 'material', label: 'Material', value: 'Porcelain' },
                { key: 'height', label: 'Height (cm)', value: '42' },
                { key: 'condition', label: 'Condition', value: 'Has cracks' },
            ],
        },
        {
            title: 'Art Nouveau Bronze Chandelier',
            description: 'Stunning Art Nouveau chandelier with floral motifs',
            content: 'Six-arm bronze chandelier with original glass shades. Floral and leaf motifs throughout. Fully restored and rewired.',
            image: 'uploads/chandelier.jpg',
            author: users[0]._id,
            category: catChandeliers._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1905' },
                { key: 'style', label: 'Style', value: 'Art Nouveau' },
                { key: 'material', label: 'Material', value: 'Bronze, glass' },
                { key: 'size', label: 'Size (cm)', value: '80x60' },
                { key: 'condition', label: 'Condition', value: 'Excellent' },
            ],
        },
        {
            title: 'Persian Oriental Rug, XVII c.',
            description: 'Hand-knotted Persian rug with traditional geometric patterns',
            content: 'Finely hand-knotted wool rug from Persia. Features intricate geometric and floral medallion design. Some wear consistent with age.',
            image: 'uploads/rug.jpg',
            author: users[1]._id,
            category: catOrientalRugs._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Year', value: '1650' },
                { key: 'origin', label: 'Country of origin', value: 'Persia' },
                { key: 'material', label: 'Material', value: 'Wool' },
                { key: 'size', label: 'Size (cm)', value: '200x300' },
                { key: 'condition', label: 'Condition', value: 'Good' },
            ],
        },
    ]);
    console.log('✅ Публікації створено');

    // ─── FAVOURITES ───────────────────────────────────────
    // John: чужие публикации в избранном
    await User.findByIdAndUpdate(users[1]._id, {
        favourites: [
            publications[2]._id, // Landscape (Jane's)
            publications[5]._id, // Vase (Jane's)
            publications[6]._id, // Chandelier (Admin's)
        ]
    });

    // Jane: чужие и свои в избранном
    await User.findByIdAndUpdate(users[2]._id, {
        favourites: [
            publications[0]._id, // Hat (John's)
            publications[4]._id, // Armchair (John's)
            publications[7]._id, // Rug (John's)
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
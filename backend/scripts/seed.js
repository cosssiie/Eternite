require('dotenv').config();
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
        },
        {
            name: 'John Doe',
            email: 'john@test.com',
            password: await bcrypt.hash('user123', 10),
            role: 'user',
            isActive: true,
            verifyToken: null,
        },
        {
            name: 'Jane Smith',
            email: 'jane@test.com',
            password: await bcrypt.hash('user123', 10),
            role: 'user',
            isActive: true,
            verifyToken: null,
        },
    ]);
    console.log('Користувачів створено');

    // ─── ROOT CATEGORIES ─────────────────────────────────
    const [catClothes, catArt, catFurniture, catCoins] = await Category.insertMany([
        { name: 'Одяг', slug: 'odyag', parent: null, isActive: true },
        { name: 'Предмети мистецтва', slug: 'mystetstvo', parent: null, isActive: true },
        { name: 'Меблі', slug: 'mebli', parent: null, isActive: true },
        { name: 'Монети та медалі', slug: 'monety', parent: null, isActive: true },
    ]);
    console.log('Кореневі категорії створено');

    // ─── SUBCATEGORIES ────────────────────────────────────
    const [
        catAccessories,
        catOuterwear,
        catPaintings,
        catMosaic,
        catChairs,
        catTables,
        catCoinsAncient,
        catMedals,
    ] = await Category.insertMany([
        { name: 'Аксесуари', slug: 'aksesuary', parent: catClothes._id, isActive: true },
        { name: 'Верхній одяг', slug: 'verkhniy-odyag', parent: catClothes._id, isActive: true },
        { name: 'Картини', slug: 'kartyny', parent: catArt._id, isActive: true },
        { name: 'Мозаїка', slug: 'mozayika', parent: catArt._id, isActive: true },
        { name: 'Крісла', slug: 'krisla', parent: catFurniture._id, isActive: true },
        { name: 'Столи', slug: 'stoly', parent: catFurniture._id, isActive: true },
        { name: 'Античні монети', slug: 'antychni-monety', parent: catCoins._id, isActive: true },
        { name: 'Медалі', slug: 'medali', parent: catCoins._id, isActive: true },
    ]);
    console.log('Підкатегорії створено');

    // ─── TEMPLATES ────────────────────────────────────────
    await CategoryTemplate.insertMany([
        {
            category: catAccessories._id,
            fields: [
                { key: 'year', label: 'Рік виготовлення', type: 'number', required: true },
                {
                    key: 'condition', label: 'Стан', type: 'select', required: true,
                    options: ['відмінний', 'добрий', 'задовільний', 'потребує реставрації']
                },
                { key: 'material', label: 'Матеріал', type: 'text' },
                { key: 'origin', label: 'Країна походження', type: 'text' },
            ],
        },
        {
            category: catOuterwear._id,
            fields: [
                { key: 'year', label: 'Рік виготовлення', type: 'number', required: true },
                {
                    key: 'condition', label: 'Стан', type: 'select', required: true,
                    options: ['відмінний', 'добрий', 'задовільний']
                },
                { key: 'size', label: 'Розмір', type: 'text' },
                { key: 'material', label: 'Матеріал', type: 'text' },
                { key: 'style', label: 'Стиль епохи', type: 'text' },
            ],
        },
        {
            category: catPaintings._id,
            fields: [
                { key: 'year', label: 'Рік створення', type: 'number', required: true },
                { key: 'epoch', label: 'Епоха', type: 'text', required: true },
                {
                    key: 'technique', label: 'Техніка', type: 'select',
                    options: ['олія', 'акварель', 'темпера', 'пастель', 'графіка']
                },
                { key: 'size', label: 'Розмір (см)', type: 'text' },
                {
                    key: 'condition', label: 'Стан', type: 'select',
                    options: ['відмінний', 'добрий', 'реставрована']
                },
                { key: 'school', label: 'Художня школа', type: 'text' },
            ],
        },
        {
            category: catMosaic._id,
            fields: [
                { key: 'year', label: 'Рік створення', type: 'number', required: true },
                { key: 'epoch', label: 'Епоха', type: 'text' },
                {
                    key: 'material', label: 'Матеріал', type: 'select',
                    options: ['скло', 'камінь', 'кераміка', 'змішана техніка']
                },
                { key: 'size', label: 'Розмір (см)', type: 'text' },
                {
                    key: 'condition', label: 'Стан', type: 'select',
                    options: ['відмінний', 'добрий', 'фрагментарна']
                },
            ],
        },
        {
            category: catChairs._id,
            fields: [
                { key: 'year', label: 'Рік виготовлення', type: 'number', required: true },
                {
                    key: 'style', label: 'Стиль', type: 'select',
                    options: ['бароко', 'класицизм', 'ампір', 'модерн', 'вікторіанський']
                },
                { key: 'material', label: 'Матеріал', type: 'text' },
                {
                    key: 'condition', label: 'Стан', type: 'select',
                    options: ['відмінний', 'добрий', 'потребує реставрації']
                },
                { key: 'origin', label: 'Країна походження', type: 'text' },
            ],
        },
        {
            category: catTables._id,
            fields: [
                { key: 'year', label: 'Рік виготовлення', type: 'number', required: true },
                {
                    key: 'style', label: 'Стиль', type: 'select',
                    options: ['бароко', 'класицизм', 'ампір', 'модерн']
                },
                { key: 'material', label: 'Матеріал', type: 'text' },
                { key: 'size', label: 'Розмір (см)', type: 'text' },
                {
                    key: 'condition', label: 'Стан', type: 'select',
                    options: ['відмінний', 'добрий', 'потребує реставрації']
                },
            ],
        },
        {
            category: catCoinsAncient._id,
            fields: [
                { key: 'year', label: 'Рік карбування', type: 'text', required: true },
                { key: 'epoch', label: 'Епоха', type: 'text', required: true },
                {
                    key: 'material', label: 'Матеріал', type: 'select',
                    options: ['золото', 'срібло', 'бронза', 'мідь']
                },
                { key: 'diameter', label: 'Діаметр (мм)', type: 'number' },
                {
                    key: 'condition', label: 'Стан', type: 'select',
                    options: ['відмінний', 'добрий', 'задовільний']
                },
                { key: 'origin', label: 'Країна походження', type: 'text' },
            ],
        },
        {
            category: catMedals._id,
            fields: [
                { key: 'year', label: 'Рік виготовлення', type: 'number', required: true },
                { key: 'country', label: 'Країна', type: 'text', required: true },
                {
                    key: 'material', label: 'Матеріал', type: 'select',
                    options: ['золото', 'срібло', 'бронза']
                },
                {
                    key: 'condition', label: 'Стан', type: 'select',
                    options: ['відмінний', 'добрий', 'задовільний']
                },
                { key: 'award', label: 'За що нагорода', type: 'text' },
            ],
        },
    ]);
    console.log('Шаблони створено');

    // ─── PUBLICATIONS ─────────────────────────────────────
    await Publication.insertMany([
        {
            title: 'Капелюх дамський, 1890',
            description: 'Розкішний дамський капелюх кінця XIX століття',
            content: 'Капелюх виготовлений з французького фетру, прикрашений шовковою стрічкою та штучними квітами. Збережено оригінальну форму та колір.',
            image: 'uploads/hat.jpg',
            author: users[1]._id,
            category: catAccessories._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Рік виготовлення', value: '1890' },
                { key: 'condition', label: 'Стан', value: 'добрий' },
                { key: 'material', label: 'Матеріал', value: 'фетр' },
                { key: 'origin', label: 'Країна походження', value: 'Франція' },
            ],
        },
        {
            title: 'Жакет вікторіанської епохи',
            description: 'Жіночий жакет вікторіанської епохи з оригінальними ґудзиками',
            content: 'Жакет пошитий з натуральної вовни темно-синього кольору. Оригінальні перламутрові ґудзики збережені повністю. Підкладка потребує незначного ремонту.',
            image: 'uploads/jacket.jpg',
            author: users[1]._id,
            category: catOuterwear._id,
            status: 'pending',
            attributes: [
                { key: 'year', label: 'Рік виготовлення', value: '1875' },
                { key: 'condition', label: 'Стан', value: 'задовільний' },
                { key: 'size', label: 'Розмір', value: 'S' },
                { key: 'material', label: 'Матеріал', value: 'вовна' },
                { key: 'style', label: 'Стиль епохи', value: 'вікторіанський' },
            ],
        },
        {
            title: 'Пейзаж невідомого автора, XIX ст.',
            description: 'Олійний пейзаж французької школи живопису',
            content: 'Картина написана олійними фарбами на полотні. Зображено сільський пейзаж з річкою та деревами. Пройшла реставрацію у 2010 році.',
            image: 'uploads/painting.jpg',
            author: users[2]._id,
            category: catPaintings._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Рік створення', value: '1860' },
                { key: 'epoch', label: 'Епоха', value: 'Романтизм' },
                { key: 'technique', label: 'Техніка', value: 'олія' },
                { key: 'size', label: 'Розмір (см)', value: '60x80' },
                { key: 'condition', label: 'Стан', value: 'реставрована' },
                { key: 'school', label: 'Художня школа', value: 'французька' },
            ],
        },
        {
            title: 'Візантійська мозаїка, фрагмент',
            description: 'Фрагмент візантійської мозаїки зі скляної смальти',
            content: 'Унікальний фрагмент візантійської мозаїки X століття. Виготовлений зі скляної смальти золотого та синього кольорів. Зображено фрагмент орнаменту.',
            image: 'uploads/mosaic.jpg',
            author: users[0]._id,
            category: catMosaic._id,
            status: 'rejected',
            moderationComment: 'Недостатньо інформації про походження експонату',
            attributes: [
                { key: 'year', label: 'Рік створення', value: '900' },
                { key: 'epoch', label: 'Епоха', value: 'Візантія' },
                { key: 'material', label: 'Матеріал', value: 'скло' },
                { key: 'size', label: 'Розмір (см)', value: '30x30' },
                { key: 'condition', label: 'Стан', value: 'фрагментарна' },
            ],
        },
        {
            title: 'Крісло в стилі ампір',
            description: 'Розкішне крісло початку XIX століття в стилі ампір',
            content: 'Крісло виготовлене з горіхового дерева з позолоченими деталями. Оббивка замінена на автентичну тканину відповідного періоду.',
            image: 'uploads/chair.jpg',
            author: users[1]._id,
            category: catChairs._id,
            status: 'inactive',
            attributes: [
                { key: 'year', label: 'Рік виготовлення', value: '1815' },
                { key: 'style', label: 'Стиль', value: 'ампір' },
                { key: 'material', label: 'Матеріал', value: 'горіх, позолота' },
                { key: 'condition', label: 'Стан', value: 'добрий' },
                { key: 'origin', label: 'Країна походження', value: 'Франція' },
            ],
        },
        {
            title: 'Срібна монета Римської імперії',
            description: 'Срібний денарій часів правління Августа',
            content: 'Срібний денарій карбований у період правління імператора Августа. На аверсі зображено профіль імператора, на реверсі — богиня Вікторія.',
            image: 'uploads/coin.jpg',
            author: users[2]._id,
            category: catCoinsAncient._id,
            status: 'approved',
            attributes: [
                { key: 'year', label: 'Рік карбування', value: '27 до н.е.' },
                { key: 'epoch', label: 'Епоха', value: 'Стародавній Рим' },
                { key: 'material', label: 'Матеріал', value: 'срібло' },
                { key: 'diameter', label: 'Діаметр (мм)', value: '18' },
                { key: 'condition', label: 'Стан', value: 'добрий' },
                { key: 'origin', label: 'Країна походження', value: 'Римська імперія' },
            ],
        },
    ]);
    console.log('Публікації створено');

    console.log('Наповлення бд завершено успішно!');
    process.exit();
};

seed().catch(err => {
    console.error('Помилка:', err);
    process.exit(1);
});
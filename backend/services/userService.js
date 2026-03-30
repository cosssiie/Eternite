const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/userRepository');
const publicationRepository = require('../repositories/publicationRepository');


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const register = async ({ name, email, password }) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error('Email is already in use');

    const hashed = await bcrypt.hash(password, 10);
    const verifyToken = crypto.randomBytes(32).toString('hex');

    const user = await userRepository.create({
        name,
        email,
        password: hashed,
        verifyToken,
        isActive: false,
    });

    await sendVerificationEmail(email, verifyToken);

    return user;
};

const login = async ({ email, password }) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error('Incorrect email or password');
    if (!user.isActive) throw new Error('Confirm your email before Sign in');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Incorrect email or password');

    const token = generateToken(user._id, user.role);

    return {
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role }
    };
};

const verifyEmail = async (token) => {
    const user = await userRepository.findByVerifyToken(token);
    if (!user) throw new Error('Invalid token');

    const updatedUser = await userRepository.updateById(user._id, {
        isActive: true,
        verifyToken: null,
    });

    const jwtToken = generateToken(updatedUser._id, updatedUser.role);

    return {
        token: jwtToken,
        user: {
            id: updatedUser._id,
            name: updatedUser.name,
            role: updatedUser.role
        }
    };
};

const getById = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User is not found');
    return user;
};

const getAll = () => userRepository.findAll();

const update = async (id, data) => {
    const user = await userRepository.updateById(id, data);
    if (!user) throw new Error('User is not found');
    return user;
};

const remove = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User is not found');

    const publications = await publicationRepository.findManyByAuthor(id);
    const publicationIds = publications.map(p => p._id);

    if (publicationIds.length > 0) {
        await userRepository.removePublicationFromAllFavourites(publicationIds);
        await publicationRepository.deleteManyByAuthor(id);
    }

    await userRepository.deleteById(id);
};

const toggleActive = async (id) => {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User is not found');
    return userRepository.updateById(id, { isActive: !user.isActive });
};

const toggleFavourite = async (userId, publicationId) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const isFavourite = user.favourites
        .map(id => id.toString())
        .includes(publicationId);

    if (isFavourite) {
        return userRepository.removeFromFavourites(userId, publicationId);
    } else {
        return userRepository.addToFavourites(userId, publicationId);
    }
};

const getFavourites = async (userId) => {
    const user = await userRepository.getFavourites(userId);
    if (!user) throw new Error('User not found');
    return user.favourites;
};

// ─── Helpers ─────────────────────────────────────────

const sendVerificationEmail = async (email, token) => {
    const link = `http://localhost:5173/verify/${token}`;

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Confirm registration on Éternité',
        html: `
<div style="max-width: 400px; margin: 0 auto; background: #FFFDF9; padding: 40px 32px;">
  <div style="font-family: Ethic New; text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 24px; margin-bottom: 32px;">
    <span style="font-size: 32px; color: #221F1D;">Éternité</span>
  </div>

  <p style="font-family: Termina Test, sans-serif; font-size: 16px; color: #221F1D; margin-bottom: 0px;">Dear, user!</p>
  <p style="font-family: Termina Test, sans-serif; font-size: 12px; color: #221F1D; line-height: 1.6; margin-bottom: 32px;">
    To confirm registration — press a button below
  </p>
  <div style="text-align: center; margin-bottom: 40px;">
     <a href="${link}" style="
      display: inline-block;
      background: #221F1D;
      color: #FFFDF9;
      text-decoration: none;
      padding: 12px 24px;
      font-family: Termina Test, sans-serif;
      font-size: 12px;
    ">Confirm</a>
  </div>

  <div style="border-top: 1px solid #e0e0e0; padding-top: 20px;">
    <p style=" font-family: Termina Test, sans-serif; font-size: 12px; color: #aaaaaa; margin: 0;">
      If you did not register — please ignore this email.
    </p>
  </div>

</div>
`,
    });
};


module.exports = {
    register,
    login,
    verifyEmail,
    getById,
    getAll,
    update,
    remove,
    toggleActive,
    toggleFavourite,
    getFavourites,
};
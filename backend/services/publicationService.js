const publicationRepository = require('../repositories/publicationRepository');
const userRepository = require('../repositories/userRepository');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const getAll = async ({ status, category, search, page, limit, attrs } = {}) => {
    return await publicationRepository.findWithFilters({
        status: status || 'approved',
        category: category && category !== 'undefined' ? category : undefined,
        search,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 12,
        attrs,
    });
};

const getAllForAdmin = (filters = {}) =>
    publicationRepository.findWithFilters(filters);

const getById = async (id) => {
    const publication = await publicationRepository.findById(id);
    if (!publication) throw new Error('Публікацію не знайдено');
    return publication;
};

const getByAuthor = (authorId) =>
    publicationRepository.findByAuthor(authorId);

const create = (data) => {
    if (typeof data.attributes === 'string') {
        data.attributes = JSON.parse(data.attributes);
    }
    return publicationRepository.create(data);
};

const update = async (id, data) => {
    if (typeof data.attributes === 'string') {
        data.attributes = JSON.parse(data.attributes);
    }
    const publication = await publicationRepository.updateById(id, data);
    if (!publication) throw new Error('Публікацію не знайдено');
    return publication;
};

const remove = async (id) => {
    const publication = await publicationRepository.deleteById(id);
    if (!publication) throw new Error('Публікацію не знайдено');
};

const approve = (id) =>
    publicationRepository.updateById(id, {
        status: 'approved',
        moderationComment: null,
    });

const reject = async (id, comment) => {
    if (!comment) throw new Error('Give the reason');

    const publication = await publicationRepository.findById(id);
    if (!publication) throw new Error('Publication not found');
    const author = await userRepository.findById(publication.author);

    if (author?.email) {
        await sendRejectionEmail(author.email, author.name, publication.title, comment);
    }

    return publicationRepository.updateById(id, {
        status: 'rejected',
        moderationComment: comment,
    });
};

const toggleActive = async (id) => {
    const publication = await publicationRepository.findById(id);
    if (!publication) throw new Error('Публікацію не знайдено');

    const newStatus = publication.status === 'inactive' ? 'approved' : 'inactive';
    return publicationRepository.updateById(id, { status: newStatus });
};

const sendRejectionEmail = async (email, name, publicationTitle, reason) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Your publication was not approved — Éternité`,
        html: `
<div style="max-width: 400px; margin: 0 auto; background: #FFFDF9; padding: 40px 32px;">
  <div style="text-align: center; border-bottom: 1px solid #e0e0e0; padding-bottom: 24px; margin-bottom: 32px;">
    <span style="font-size: 32px; color: #221F1D;">Éternité</span>
  </div>
  <p style="font-size: 16px; color: #221F1D;">Dear, ${name}!</p>
  <p style="font-size: 12px; color: #221F1D; line-height: 1.6;">
    Your publication <strong>"${publicationTitle}"</strong> was not approved.
  </p>
  <div style="background: #f5f5f0; padding: 16px; margin: 24px 0;">
    <p style="font-size: 12px; color: #221F1D; margin: 0;">
      <strong>Reason:</strong><br/>${reason}
    </p>
  </div>
  <p style="font-size: 12px; color: #aaaaaa;">
    You can edit your publication and resubmit it for review.
  </p>
</div>
        `,
    });
};

module.exports = {
    getAll,
    getAllForAdmin,
    getById,
    getByAuthor,
    create,
    update,
    remove,
    approve,
    reject,
    toggleActive,
    sendRejectionEmail,
};
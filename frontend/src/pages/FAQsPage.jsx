import { useState } from 'react';
import TitleHeader from '../components/TitleHeader.jsx';

const faqs = [
  {
    id: '01',
    question: 'WHAT IS ÉTERNITÉ?',
    answer: 'Éternité is a curated digital archive dedicated to the discovery and preservation of antique items. We bring together collectors, historians, and enthusiasts in one place.'
  },
  {
    id: '02',
    question: 'IS THIS A MARKETPLACE?',
    answer: 'No. Éternité is not a buying or selling platform. We are an archive — a space to document, explore, and appreciate historical items.'
  },
  {
    id: '03',
    question: 'HOW DOES MODERATION WORK?',
    answer: 'Every submission is reviewed by our team before it appears in the archive. We check for completeness, accuracy, and relevance. You will be notified of the result.'
  },
  {
    id: '04',
    question: 'WHAT KINDS OF ITEMS ARE ACCEPTED?',
    answer: 'We accept a wide range of antique items — clothing, accessories, paintings, furniture, coins, medals, and more. Items must be of historical or cultural significance.'
  },
  {
    id: '05',
    question: 'CAN MY SUBMISSION BE REJECTED?',
    answer: 'Yes. If your submission lacks sufficient information, photos, or does not meet our guidelines, it may be rejected. You will receive a comment explaining the reason.'
  }
];

function FAQsPage() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(openId === id ? null : id);

  return (
    <div className="faqs-page-container">
      <TitleHeader title="FAQs" />
      <div className="faqs-container">
        <div className="grid-col-1" />

        <div className="questions-list">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`question-option ${openId === faq.id ? 'open' : ''}`}
              onClick={() => toggle(faq.id)}
            >
              <div className="question-row">
                <div className="question-left">
                  <span className="question-number" id="text-smallest">{faq.id}</span>
                  <span className="question-text" id="button">{faq.question}</span>
                </div>
                <span className="question-arrow">{openId === faq.id ? '↓' : '→'}</span>
              </div>

              <div className={`question-answer ${openId === faq.id ? 'answer-open' : ''}`}>
                <div className="question-answer-inner" id="button">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default FAQsPage;
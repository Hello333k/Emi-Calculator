import React, { useState } from 'react';

const faqData = [
  {
    question: 'What is an EMI?',
    answer: 'EMI stands for Equated Monthly Instalment. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Each EMI consists of both a principal component and an interest component. Over the tenure, the interest portion gradually decreases while the principal repayment portion increases.'
  },
  {
    question: 'How is the reducing-balance EMI calculated?',
    answer: 'The reducing-balance formula is: E = P × r × (1+r)^n / ((1+r)^n − 1), where P is the principal loan amount, r is the monthly interest rate (annual rate / 12 / 100), and n is the total number of monthly payments. Interest is calculated on the remaining outstanding balance each month rather than the initial loan amount.'
  },
  {
    question: 'What happens if the interest rate is 0%?',
    answer: 'Under a 0% interest rate, no interest accrues over the loan term. The EMI formula simplifies directly to: EMI = Principal / Total Months. The total repayment equals the principal, with zero interest cost.'
  },
  {
    question: 'Does choosing a longer loan tenure reduce the monthly EMI?',
    answer: 'Yes. Extending the tenure distributes the principal repayment across more months, lowering the individual monthly payment. However, because interest accrues over a longer period, the total interest paid over the life of the loan increases substantially.'
  },
  {
    question: 'What is an amortization schedule?',
    answer: 'An amortization schedule is an itemized breakdown of every periodic loan payment throughout the entire loan duration. It clearly details how much of each payment goes toward paying down principal, how much goes toward interest, and the exact remaining balance after each month.'
  },
  {
    question: 'How do extra payments affect my loan?',
    answer: 'Extra payments are applied directly against the outstanding principal balance. This reduces the balance on which subsequent interest is calculated, accelerating payoff and significantly shortening the loan tenure while reducing total interest expense.'
  },
  {
    question: 'Are these calculation results exact?',
    answer: 'These calculations follow standard financial mathematics. However, actual lender figures may vary slightly due to institution-specific rounding rules, calendar day counting conventions (such as 30/360 or Actual/365), upfront administration fees, mortgage insurance, or property taxes.'
  }
];

function FAQItem({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `faq-content-${index}`;

  return (
    <div className="faq-item">
      <button 
        type="button"
        className="faq-question" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span>{item.question}</span>
        <svg 
          width="18"
          height="18"
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform var(--transition-fast)',
            flexShrink: 0
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div id={contentId} className="faq-answer">
          {item.answer}
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '32px' }} aria-labelledby="faq-section-heading">
      <div className="section-header">
        <h2 id="faq-section-heading">Frequently asked questions</h2>
        <p className="text-secondary text-small">Quick answers to common questions about loan calculations and amortization</p>
      </div>
      <div>
        {faqData.map((item, index) => (
          <FAQItem key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

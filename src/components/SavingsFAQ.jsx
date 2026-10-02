import React, { useState } from 'react';

const savingsFaqData = [
  {
    question: 'What is compound interest?',
    answer: 'Compound interest is the interest you earn on both your original starting principal and the interest that accumulates from previous periods. Over longer horizons, compounding exponentially accelerates the growth of your balance because you earn returns on past earnings.'
  },
  {
    question: 'How does monthly saving affect growth?',
    answer: 'Saving each month introduces regular additions into your compounding balance throughout the year. Earlier deposits immediately begin earning interest, generating substantially more total growth than contributing the same sum as a single lump-sum at the end of the year.'
  },
  {
    question: 'What is the difference between saving monthly and yearly?',
    answer: 'Saving monthly distributes deposits evenly across 12 periods per year, allowing earlier installments to accumulate interest sooner. Yearly saving deposits the full amount once every twelve months, giving compound interest fewer active cycles throughout the interim months.'
  },
  {
    question: 'What is APY?',
    answer: 'APY stands for Annual Percentage Yield. It reflects the total annual rate of return after taking into account the effect of compound interest over a one-year period. It provides a standardized figure for comparing accounts with different compounding schedules.'
  },
  {
    question: 'What is the difference between APY and an annual interest rate?',
    answer: 'An annual nominal interest rate is the base interest rate before factoring in compounding. APY is the effective annualized return that includes the compounding effect. If interest compounds more frequently than once a year, APY will always be higher than the nominal interest rate.'
  },
  {
    question: 'Why does compounding frequency matter?',
    answer: 'The more frequently interest is compounded (e.g. daily vs. monthly vs. annually), the faster interest accumulates and starts earning interest on itself. While the difference between monthly and daily compounding is modest for short horizons, it compounds noticeably over multi-decade periods.'
  },
  {
    question: 'What happens if I increase my monthly contribution?',
    answer: 'Increasing your regular contribution increases your total personal savings and accelerates compound interest by enlarging the capital base that earns returns. Even a modest annual step-up (such as 3–5%) significantly expands the final accumulated balance over 10 to 30 years.'
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'This calculator follows rigorous compound interest and annuity mathematics. However, real-world yields may vary slightly due to variable interest rate policies, calendar day count conventions (such as 365 vs. 360 days), account maintenance fees, or jurisdiction-specific interest taxes.'
  },
  {
    question: 'What does "today\'s money" mean?',
    answer: '"Today\'s money" refers to the inflation-adjusted purchasing power of your projected future balance. Due to general price inflation over time, a nominal sum in 10 or 20 years buys fewer goods and services than that same sum today. The inflation adjustment discounts the nominal projection back to current purchasing value.'
  },
  {
    question: 'How is a savings goal calculated?',
    answer: 'The savings goal calculator uses the mathematical inverse of the future-value annuity formula. Given your target amount, initial balance, expected rate, and deadline, it algebraically solves for the exact periodic deposit needed so that your deposits plus compound growth equal your target.'
  }
];

function FAQItem({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `savings-faq-content-${index}`;

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
            flexShrink: 0,
            marginLeft: '16px',
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

export default function SavingsFAQ() {
  return (
    <section className="section" style={{ borderTop: '1px solid var(--border-color)', marginTop: '36px' }} aria-labelledby="savings-faq-heading">
      <div className="section-header">
        <h2 id="savings-faq-heading">Frequently asked questions</h2>
        <p className="text-secondary text-small">
          Common questions about compound growth, APY, contribution frequencies, and goal planning
        </p>
      </div>

      <div className="faq-list" role="region" aria-label="Savings FAQ accordion">
        {savingsFaqData.map((item, index) => (
          <FAQItem key={item.question} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

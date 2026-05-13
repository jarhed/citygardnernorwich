export const metadata = { title: "FAQs — The City Gardener" };

const faqs = [
  {
    q: "Do you provide a quote free of charge?",
    a: "Yes I do. Once you have my quote, you are free to book my services or not, no charge.",
  },
  {
    q: "Do I have to pay for all of the work quoted upfront?",
    a: "That would be lovely, however, I'll happily break down the cost into two part payments. One payment is made prior to the work starting and then a final payment on completion of the work.",
  },
  {
    q: "Can you landscape my garden?",
    a: "I provide a basic garden maintenance service, however, I will happily provide a cost for additional planting ideas and plant delivery. Feel free to ask.",
  },
  {
    q: "Do you remove my garden waste?",
    a: "I can organise your garden waste to be removed at an additional cost. This cost will be discussed and agreed in your initial quote.",
  },
  {
    q: "What happens if I cancel a job?",
    a: "If the work is cancelled within 48 hours of the job starting, I'm able to refund the initial payment. Good news, if you rebook your initial payment can be carried forward.",
  },
  {
    q: "Do I need to be at home while you carry out the work?",
    a: "If the work requires hedging, jetting or strimming, then I will need access to a socket or tap. This can be discussed during the initial quote.",
  },
  {
    q: "Do I get a referral fee?",
    a: "If you refer me to a friend or colleague, you receive a discount on my next visit to your garden.",
  },
];

export default function FaqPage() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Let&apos;s shed light on things</h1>
            <div className="leaf-divider">
              <img src="/images/leaf_outline_green.svg" alt="" />
            </div>
            <div className="faq-grid">
              {faqs.map((item, i) => (
                <div key={i} className="faq-item">
                  <h3 className="faq-question">{item.q}</h3>
                  <p className="faq-answer">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const metadata = { title: "Testimonials — The City Gardener" };

const testimonials = [
  {
    quote:
      "As I don't have a lot of time for the garden, I called Kate and got a very reasonable quote to have my garden tidied. The garden was cleared and tidied which gave me a quick and easy fix to allow for a low maintenance garden. I am very pleased with the work and will definitely use again, thank you Kate.",
    author: "Graham, Homeowner",
  },
  {
    quote:
      "My large decking area needed a spring clean so I called The City Gardener, Kate. As described, she was cheerful, detailed and provided a very efficient and reliable service. Kate cleaned and treated the decking and it looks wonderful. I'll be asking Kate to come back and maintain the rest of my garden and my AirBnB's garden.",
    author: "Julia, Homeowner",
  },
  {
    quote:
      "I would highly recommend Kate to anyone who needs some gardening work completing. She made our garden look the best it's been for a long time and even happily let my 4 year old 'help'. Gardening is Kate's happy place, so you know you can count on her to do a thorough job.",
    author: "Nikki, Tenant",
  },
];

export default function TestimonialsPage() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>People really dig my work</h1>
            <div className="leaf-divider">
              <img src="/images/leaf_outline_green.svg" alt="" />
            </div>
            <div className="testimonials-grid" style={{ paddingBottom: 20 }}>
              {testimonials.map((t, i) => (
                <div key={i} className="testimonial-card">
                  <div className="testimonial-content">
                    <div className="testimonial-quote">
                      <span className="quote-mark">&ldquo;</span>
                      <p>{t.quote}</p>
                      <span className="quote-mark quote-mark-end">&rdquo;</span>
                    </div>
                    <div className="testimonial-author">{t.author}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

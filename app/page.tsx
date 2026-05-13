export default function HomePage() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-image">
            <img src="/images/kate.jpeg" alt="Kate the City Gardener working in a garden" />
          </div>
          <div className="hero-text">
            <h1>I&apos;m Kate, the City Gardener</h1>
            <div className="leaf-divider">
              <img src="/images/leaf_outline_green.svg" alt="" />
            </div>
            <p>
              I&apos;ve turned a hobby into a small, independent business helping you and your neighbours
              appreciate and enjoy your gardens. Whether you&apos;re a tenant, a landlord, homeowner or perhaps
              you own an Airbnb or two, I can bring your garden back to life with a little weeding, leaf
              clearing, hedge cutting, seasonal pruning and if your garden is &apos;tap ready&apos;, I can even
              clean your pathway or refresh your decking.
            </p>
            <p>
              If you have every intention, but never the time, leave a message on 07736 249919. Or, if you
              prefer, email me with some pictures of the space that needs some KLC (Kate&apos;s love and care)
              and I&apos;ll happily send you a quote.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

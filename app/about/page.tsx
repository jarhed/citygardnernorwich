export const metadata = { title: "About me — The City Gardener" };

export default function AboutPage() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>A little about me</h1>
            <div className="leaf-divider">
              <img src="/images/leaf_outline_green.svg" alt="" />
            </div>
            <p>
              Growing up in the countryside, I was always encouraged to enjoy the outdoors. I would spend
              hours playing outside. The woods, fields and haystacks were my playground.
            </p>
            <p>
              My parents and grandparents also inspired my love of nature. My paternal grandmother was a
              botanist, so from a very young age, I found huge comfort in digging, weeding and naming plants
              and flowers. My imagination was captured.
            </p>
            <p>
              As I grew up, I pursued a corporate career in London, but I always found comfort weeding,
              digging, planting and pruning in the garden. Fast forward and I&apos;m now living in Norwich,
              having found my &apos;heaven on earth&apos;.
            </p>
            <p>
              Armed with my trowels and trimmers, I&apos;ve been lucky enough to turn a hobby into a business.
              A small, independent offer with a simple mission to help you and your neighbours enjoy the
              soothing benefits of your outdoor space.
            </p>
          </div>
          <div className="hero-image">
            <img src="/images/about_me.jpeg" alt="Kate the City Gardener working in a garden" />
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="homePage">

      <div className="hero-card">

        <h1>LevelUp</h1>

        <p className="description">
          LevelUp is a gamified to-do system that turns your tasks into XP, levels, and motivation.
        </p>

        <div className="cta-btn">
          <Link href="/signup">
            <button className="primary-btn">Get Started</button>
          </Link>

          <Link href="/login">
            <button className="secondary-btn">Log in</button>
          </Link>
        </div>

      </div>

      <section className="features">
        <div className="feature-card">
          <h3> Level Up System</h3>
          <p>Earn XP and level up as you complete tasks.</p>
        </div>

        <div className="feature-card">
          <h3> Smart Tasks</h3>
          <p>Organize by category and set difficulty to earn more XP.</p>
        </div>

        <div className="feature-card">
          <h3> Leaderboards</h3>
          <p>Compete with others and climb rankings.</p>
        </div>
      </section>

    </main>
  );
}


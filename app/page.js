import Link from "next/link";


export default function Home() {

  return(
  <main className="homePage">
    <h1>LevelUp</h1>

    <p>LevelUp is a gamified to-do list...</p>

    <div className="signLog-btn">
      <Link href="/signup">
        <button>Get Started</button>
      </Link>

      <Link href="/login">
        <button>Log in</button>
      </Link>
    </div>

  </main>
  )
}


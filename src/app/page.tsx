export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh"
      }}
    >
      <nav
        style={{
          minWidth: "225px",
          backgroundColor: "blue"
        }}
      >
        Nav
      </nav>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <header
          style={{
            height: "100px",
            width: "100%",
            backgroundColor: "red"
          }}
        >
          Header
        </header>
        <main
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "green",
          }}
        >
          Content
        </main>
      </div>
    </div>
  );
}

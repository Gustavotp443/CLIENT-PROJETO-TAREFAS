import Footer from "./shared/components/footer";
import Header from "./shared/components/header";
import Tasks from "./tasks";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 m-[4%]">
        <Tasks />
      </main>
      <Footer />
    </div>
  );
}

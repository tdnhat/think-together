import { CallToAction, Features, Hero, Stats } from "@/widgets/landing";
import { Footer } from "@/widgets/footer";
import { Navbar } from "@/widgets/navbar";

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Stats />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}

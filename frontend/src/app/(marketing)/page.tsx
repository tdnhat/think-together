import { CallToAction, Features, Hero, Stats } from "@/components/landing";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

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

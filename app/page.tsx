import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedWork } from "@/components/sections/FeaturedWork";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center px-6 bg-(--background-color-white)">
      <HeroSection />
      <FeaturedWork />
    </main>
  );
}

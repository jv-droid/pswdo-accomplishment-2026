import React from "react";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { VideoSection } from "./components/VideoSection";
import { Mandate } from "./components/Mandate";
import { Programs } from "./components/Programs";
import { MapSection } from "./components/MapSection";
import { Personnel } from "./components/Personnel";
import { Systems } from "./components/Systems";
import { Budget } from "./components/Budget";
import { Challenges } from "./components/Challenges";
import { Targets } from "./components/Targets";
import { Impact } from "./components/Impact";
import { Footer } from "./components/Footer";

export const App: React.FC = () => (
  <>
    <Nav />
    <main>
      <Hero />
      <Marquee />
      <VideoSection />
      <Mandate />
      <Programs />
      <MapSection />
      <Personnel />
      <Systems />
      <Budget />
      <Challenges />
      <Targets />
      <Impact />
    </main>
    <Footer />
  </>
);

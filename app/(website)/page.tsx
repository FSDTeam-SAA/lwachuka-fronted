import { Advertisements } from '@/components/Home/Advertisements'
import { AgentsSection } from '@/components/Home/AgentsSection'
import { BrowsePurpose } from '@/components/Home/BrowsePurpose'
import { FeaturedProperties } from '@/components/Home/FeaturedProperties'
import { Footer } from '@/components/Home/Footer'
import { HeroSection } from '@/components/Home/HeroSection'
import { LocationExplorer } from '@/components/Home/LocationExplorer'
import { Navbar } from '@/components/Home/Navbar'
import { SearchFilter } from '@/components/Home/SearchFilter'
import { WhyChoose } from '@/components/Home/WhyChoose'
import type { Metadata } from 'next'


export const metadata: Metadata = {
  title: 'HomeFinder ',
  description: 'Discover your perfect property with HomeFinder. Browse thousands of listings, connect with agents, and find your dream home.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar/>
      <HeroSection />
      <SearchFilter />
      <FeaturedProperties/>
      <BrowsePurpose />
      <WhyChoose/>
      <Advertisements/>
      <AgentsSection />
      <LocationExplorer />
      <Footer/>
    </main>
  )
}

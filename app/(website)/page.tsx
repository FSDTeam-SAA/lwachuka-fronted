import { Advertisements } from '@/components/Home/Advertisements'
import { AgentsSection } from '@/components/Home/AgentsSection'
import { BrowsePurpose } from '@/components/Home/BrowsePurpose'
import { FeaturedProperties } from '@/components/Home/FeaturedProperties'
import { HeroSection } from '@/components/Home/HeroSection'
import { SearchFilter } from '@/components/Home/SearchFilter'
import { ExploreByLocation } from '@/components/Home/ExploreByLocation'
import type { Metadata } from 'next'
import { WhyChoosePlatform } from '@/components/Home/WhyChoosePlatform'
import { DreamHomeCTA } from '@/components/Home/DreamHomeCTA'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'


export const metadata: Metadata = {
  title: 'HomeFinder ',
  description: 'Discover your perfect property with HomeFinder. Browse thousands of listings, connect with agents, and find your dream home.',
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  const isLoggedIn = !!session?.user

  return (
    <main className="min-h-screen bg-white">
      {!isLoggedIn && <HeroSection />}
      <SearchFilter />
      <FeaturedProperties/>
      <BrowsePurpose />
      <ExploreByLocation/>
      <AgentsSection />
      <Advertisements/>
      <WhyChoosePlatform/>
      <DreamHomeCTA/>
    
    </main>
  )
}

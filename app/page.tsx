"use client"

import { useRef, useState } from "react"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"
import DestinationGallery from "@/components/home/destination-gallery"
import HeroSlider from "@/components/home/hero-slider"
import TravelForm, { type TravelFormHandle } from "@/components/home/travel-form"
import TravelPlannerIntro from "@/components/home/travel-planner-intro"
import SeasonalDestinationSuggestions from "@/components/home/seasonal-destination-suggestions"


export default function Home() {
  const [plans, setPlans] = useState<any[]>([])
  const formRef = useRef<TravelFormHandle>(null)

  const handleCreatePlan = (newPlan: any) => {
    setPlans([...plans, newPlan])
    // TravelForm tu xu ly redirect den /trips/{id} sau khi tao xong
    // Khong push route o day de tranh double redirect
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
        <HeroSlider />

        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-10 xl:gap-x-12 gap-y-12 items-stretch w-full">
              <div className="min-w-0 w-full lg:max-w-none">
                <SeasonalDestinationSuggestions
                  className="w-full max-w-full h-full"
                  onPickPlace={(query) =>
                    formRef.current?.applyPlaceFromQuery(query) ?? Promise.resolve(false)
                  }
                />
              </div>

              <div className="min-w-0 w-full lg:max-w-none">
                <TravelPlannerIntro />
                <TravelForm ref={formRef} onPlanCreated={handleCreatePlan} />
              </div>
            </div>
          </div>
        </section>

        <DestinationGallery />
      </main>
      <Footer />
    </>
  )
}

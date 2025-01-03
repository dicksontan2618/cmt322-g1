'use client'

import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import { landingCarouselList } from "@/data/landing_carousel"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"

import Image from "next/image"

function CompanyCarousel () {

    const plugin = React.useRef(
        Autoplay({delay: 1500, stopOnInteraction: false})
    )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      // onMouseEnter={plugin.current.stop}
      // onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {landingCarouselList.map((item, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
            <div className="p-0">
              <Card className="text-black bg-white">
                <CardHeader>
                  <CardTitle className="text-md">{item.company_name}</CardTitle>
                  <CardDescription><Badge style={{ backgroundColor: item.badgeColor }}  className="text-white">{item.category}</Badge></CardDescription>
                </CardHeader>
                <CardContent className="w-full h-56 flex aspect-square items-center justify-center">
                  <Image src={item.imgSrc} alt={item.company_name} width={150} height={150}/>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

export default CompanyCarousel
import { Card, CardContent } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faMapPin } from "@fortawesome/free-solid-svg-icons";

import Countdown from "@/components/Countdown";
import About from "@/components/About";
import CompanyCarousel from "@/components/CompanyCarousel";
import Footer from "@/components/Footer";

import Link from "next/link";

import { ibm_plex_mono } from "./fonts";

export default async function Home() {
  return (
    <>
      <div 
        className="h-screen md:h-[40vh] lg:h-screen bg-fixed"
        style={{ backgroundImage: `url('/assets/bg-liquid-cheese.png')` }}
      >
        <div className="absolute top-[20vh] md:top-[13vh] lg:top-[20vh] w-full">
          <div
            className="flex flex-col gap-y-12 flex-wrap h-full justify-between mx-[10vw] md:mx-[5vw] md:flex-row md:items-center lg:mx-[10vw]"
          >
            <div className="flex flex-col gap-y-8 md:w-1/2">
              <p
                className={`${ibm_plex_mono.className} text-white text-4xl font-bold leading-tight lg:w-[40%] lg:text-6xl lg:leading-snug drop-shadow-2xl`}
              >
                Computer Science Industry Career eXploration
              </p>
              <div>
                <Card className="bg-gray-600 border-none lg:w-full">
                  <CardContent className="p-6 lg:p-12">
                    <div className="flex flex-col gap-y-4">
                      <div className="flex gap-x-4 text-white items-center">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          className="lg:text-2xl"
                        ></FontAwesomeIcon>
                        <p className="font-semibold lg:text-2xl">13th January 2025</p>
                      </div>
                      <div className="flex gap-x-4 text-white items-center">
                        <FontAwesomeIcon
                          icon={faMapPin}
                          className="lg:text-2xl"
                        ></FontAwesomeIcon>
                        <p className="font-semibold lg:text-2xl">
                          USM Hamzah Sendut Library
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <Countdown />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center px-8 py-2 gap-y-12 mt-8 sm:p-8">
        <div
          className="flex flex-col items-center gap-y-6 lg:gap-y-8"
        >
          <p
            className={`${ibm_plex_mono.className} text-center text-primary text-5xl font-extrabold leading-none drop-shadow-xl`}
          >
            About CSICX
          </p>
          <About />
        </div>
        <div className="w-full flex flex-col text-primary text-center items-center gap-y-4 md:justify-center lg:mt-8">
          <p
            className={`${ibm_plex_mono.className} text-4xl font-extrabold leading-none drop-shadow-xl`}
          >
            Meet Our Partner Companies
          </p>
          <p>
            Can't do it without them! Our partner companies make this event
            possible!
          </p>
        </div>
        <CompanyCarousel />
        <div className="w-full flex flex-col text-primary text-center items-center gap-y-2 mb-6 md:justify-center lg:mt-8">
          <p
            className={`${ibm_plex_mono.className} text-4xl font-extrabold drop-shadow-xl`}
          >
            Any Questions?
          </p>
          <p>
            Reach out to us at{" "}
            <Link href="mailto:contact@csicx.com">contact@csicxusm.com</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

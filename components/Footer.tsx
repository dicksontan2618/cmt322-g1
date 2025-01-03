'use client'

import { faFacebookF, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Image from "next/image"
import Link from "next/link"

function Footer () {
  return (
    <footer>
        <div className="p-10 bg-primary text-white">
            <div className="mx-auto">
                <div className="flex flex-col gap-y-4 lg:flex-row lg:justify-center lg:gap-x-8 lg:items-center">
                    <Link href="https://www.usm.my/" target="_blank">
                        <Image src="/assets/usm-apex-white.svg" alt="USM Logo" width={200} height={200}/>
                    </Link>
                    <Link href="https://cssocietyusm.com/" target="_blank">
                        <Image src="/assets/cs-soc-logo-white.svg" alt="CS Society Logo" width={75} height={75}/>
                    </Link>
                </div>
                <div className="flex mt-8 gap-x-4 lg:justify-center">
                    <Link href="https://www.facebook.com/cs.usm.my/" target="_blank"><FontAwesomeIcon icon={faFacebookF} size="2xl"/></Link>
                    <Link href="https://www.instagram.com/cs.usm/" target="_blank"><FontAwesomeIcon icon={faInstagram} size="2xl"/></Link>
                    <Link href="https://www.linkedin.com/company/cssocietyusm/" target="_blank"><FontAwesomeIcon icon={faLinkedin} size="2xl"/></Link>
                </div>
            </div>
            <div className="mx-auto text-center text-sm text-white p-4 mt-4">
                <p>© Computer Science Industry Career eXploration, Universiti Sains Malaysia. Disclaimer: All Contents, Intellectual Properties & Copyright Reserved to Universiti Sains Malaysia (USM)</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer
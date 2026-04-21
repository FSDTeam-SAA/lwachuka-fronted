import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInformationSection() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] items-center">
          {/* Map */}
          <div className="overflow-hidden rounded-2xl h-[400px]">
           <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.8297848684915!2d-81.09721532381118!3d32.07385227396545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88fb9e690194baf9%3A0x9c3041f913ef22d9!2sGreen-Meldrim%20House!5e0!3m2!1sen!2sbd!4v1772529644377!5m2!1sen!2sbd" className="w-full h-full" ></iframe>
          </div>

          {/* Contact Info */}
          <div className="pt-1">
            <h3 className="text-lg md:text-4xl font-bold text-[#05203D]">
              Contact Information
            </h3>
            <p className="mt-2 text-sm text-[#68706A] leading-6 max-w-md">
              Find all the ways to reach us, including email, phone, and our
              office address, so you can get the support and answers you need
              quickly and easily.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 ">
                  <Mail className="h-4 w-4 text-[#0B1C39]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0B1C39]">support@homefinderke.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 ">
                  <Phone className="h-4 w-4 text-[#0B1C39]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0B1C39]">+(1 555) 123-4567FCHJ</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 ">
                  <MapPin className="h-4 w-4 text-[#0B1C39]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0B1C39]">
                    123 Care Street, City, State, ZIP Address: 123 Care Street,
                    City, State, ZIP
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
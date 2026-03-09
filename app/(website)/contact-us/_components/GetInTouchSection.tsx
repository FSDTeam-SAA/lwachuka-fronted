'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { toast } from 'sonner'
interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export function GetInTouchSection() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })

  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Basic client-side validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Please enter both first and last name')
      return
    }
    if (!formData.email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    if (!formData.message.trim()) {
      toast.error('Message cannot be empty')
      return
    }
    if (!agreed) {
      toast.error('You must agree to the Terms & Conditions')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            message: formData.message.trim(),
          }),
        },
      )

      const result = await response.json()

      if (!response.ok) {
        // You can use result.message if your API returns it
        throw new Error(result.message || 'Something went wrong')
      }

      toast.success("Message sent successfully! We'll get back to you soon.", {
        duration: 5000,
      })

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
      setAgreed(false);
      //eslint-disable-next-line
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto container px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-[#EDEDED]">
          <div className="grid lg:grid-cols-2">
            {/* Left: Form */}
            <div className="p-6 sm:p-8 md:p-10">
              <h3 className="text-4xl font-bold text-[#05203D]">
                Get in Touch
              </h3>
              <p className="mt-1 text-base text-[#6C757D]">
                Our friendly team would love to hear from you.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-[#343A40]">
                      First Name
                    </label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Name Here"
                      className="h-[48px] rounded-[8px] border-[#C0C3C1] focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-medium text-[#343A40]">
                      Last Name
                    </label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Name Here"
                      className="h-[48px] rounded-[8px] border-[#C0C3C1] focus-visible:ring-0 focus-visible:ring-offset-0"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-[#343A40]">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="help@example.com"
                    className="h-[48px] rounded-[8px] border-[#C0C3C1] focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-[#343A40]">
                    Phone Number
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+880 1612345678"
                    className="h-[48px] rounded-[8px] border-[#C0C3C1] focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-[#343A40]">
                    Message
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    className="min-h-[140px] rounded-[8px] border-[#C0C3C1] resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <Checkbox
                    id="terms"
                    checked={agreed}
                    onCheckedChange={checked => setAgreed(!!checked)}
                    className="mt-0.5"
                  />
                  <label
                    htmlFor="terms"
                    className="text-[11px] leading-5 text-[#8A8A8A]"
                  >
                    You agree to our{' '}
                    <Link href="#" className="text-[#0B1C39] underline">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-[#0B1C39] underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 h-11 w-full rounded-md bg-[#05203D] hover:bg-[#05203D]/90 text-white disabled:opacity-70"
                >
                  {isLoading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Right: Image */}
            <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-full">
              <Image
                src="/contact.png"
                alt="Team"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/0 via-black/0 to-black/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

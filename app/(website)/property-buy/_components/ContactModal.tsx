'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

interface ContactModalProps {
  trigger?: React.ReactNode
}

export default function ContactModal({ trigger }: ContactModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    message: '',
  })

  const params = useParams()
  const propertyId = Array.isArray(params?.id) ? params?.id[0] : params?.id

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!propertyId) {
      toast.error('Property id is missing.')
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

    setIsLoading(true)

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OTZiZjRhNDA1Y2MxYThjNDU4YTM1ZiIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc3Mjk2ODM4NSwiZXhwIjoxNzczNTczMTg1fQ.bZoc3EWCqSjA1abkwRIAf7Vo-MGltLo_kQxAEiUbS2o'

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/contact-property/${propertyId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            phoneNumber: formData.phoneNumber.trim(),
            message: formData.message.trim(),
          }),
        },
      )

      const result = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(result.message || 'Failed to send message')
      }

      toast.success('Message sent successfully!')
      setFormData({ email: '', phoneNumber: '', message: '' })
      setOpen(false)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className="h-10 rounded-md bg-[#B78222] px-10 text-white transition hover:bg-[#9f6f1d]"
          >
            Contact Now
          </button>
        )}
      </DialogTrigger>

      <DialogContent
        className="
          w-[calc(100%-24px)]
          max-w-[560px]
          rounded-[16px]
          border-none
          bg-[#F8F8F8]
          p-0
          shadow-2xl
        "
      >
        <div className="rounded-[16px] bg-[#F8F8F8] p-5 sm:p-7">
          <div className="mb-6">
            <h2 className="text-[34px] font-bold leading-none text-[#0B2341]">
              Get in Touch
            </h2>
            <p className="mt-2 text-[18px] text-[#7A7A7A]">
              Our friendly team would love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-[15px] font-medium text-[#3D3D3D]">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                required
                className="
                  h-[48px]
                  w-full
                  rounded-[4px]
                  border
                  border-[#CFCFCF]
                  bg-transparent
                  px-4
                  text-[15px]
                  text-[#333]
                  outline-none
                  placeholder:text-[#9A9A9A]
                  focus:border-[#0B2341]
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-medium text-[#3D3D3D]">
                Phone Number
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+971 4567890"
                className="
                  h-[48px]
                  w-full
                  rounded-[4px]
                  border
                  border-[#CFCFCF]
                  bg-transparent
                  px-4
                  text-[15px]
                  text-[#333]
                  outline-none
                  placeholder:text-[#9A9A9A]
                  focus:border-[#0B2341]
                "
              />
            </div>

            <div>
              <label className="mb-2 block text-[15px] font-medium text-[#3D3D3D]">
                Message
              </label>
              <textarea
                rows={7}
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                required
                className="
                  min-h-[160px]
                  w-full
                  resize-none
                  rounded-[4px]
                  border
                  border-[#CFCFCF]
                  bg-transparent
                  px-4
                  py-3
                  text-[15px]
                  text-[#333]
                  outline-none
                  placeholder:text-[#9A9A9A]
                  focus:border-[#0B2341]
                "
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="
                h-[48px]
                w-full
                rounded-[8px]
                bg-[#0B2341]
                text-[16px]
                font-medium
                text-white
                transition
                hover:bg-[#081a31]
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

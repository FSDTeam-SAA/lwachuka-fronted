/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMutation } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Subscription } from '@/types/promotions'
import {
  initiateMpesaPayment,
  callbackMpesaPayment,
  promotionKeys,
} from '@/lib/queries/promotions'
import { useQueryClient } from '@tanstack/react-query'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const schema = z.object({
  phoneNumber: z
    .string()
    .regex(/^254\d{9}$/, 'Must be in format 254XXXXXXXXX (12 digits)'),
})

type FormValues = z.infer<typeof schema>

interface MpesaPaymentModalProps {
  subscription: Subscription | null
  isOpen: boolean
  onClose: () => void
}

export function MpesaPaymentModal({
  subscription,
  isOpen,
  onClose,
}: MpesaPaymentModalProps) {
  const { data: session } = useSession()
  const token = session?.user?.accessToken
  const queryClient = useQueryClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      phoneNumber: '',
    },
  })

  const callbackMutation = useMutation({
    mutationFn: (stkData: any) => {
      const body = {
        Body: {
          stkCallback: {
            MerchantRequestID: stkData.merchantRequestId,
            CheckoutRequestID: stkData.checkoutRequestId,
            ResultCode: 0,
            ResultDesc: 'The service request is processed successfully.',
            CallbackMetadata: {
              Item: [
                { Name: 'Amount', Value: subscription?.price || 0 },
                { Name: 'MpesaReceiptNumber', Value: stkData.paymentId },
                { Name: 'TransactionDate', Value: Date.now() },
                {
                  Name: 'PhoneNumber',
                  Value: Number(form.getValues().phoneNumber),
                },
              ],
            },
          },
        },
      }
      return callbackMpesaPayment(body, token)
    },
    onSuccess: () => {
      toast.success('Payment confirmed successfully!')
      queryClient.invalidateQueries({ queryKey: promotionKeys.subscriptions() })
      onClose()
      form.reset()
    },
    onError: () => {
      toast.error('Callback error. Please confirm payment manually.')
    },
  })

  const payMutation = useMutation({
    mutationFn: ({
      subscriptionId,
      phoneNumber,
    }: {
      subscriptionId: string
      phoneNumber: string
    }) => initiateMpesaPayment(subscriptionId, { phoneNumber }, token),
    onSuccess: data => {
      // Trigger local callback simulation immediately upon successful STK push
      callbackMutation.mutate(data.data)
    },
    onError: () => {
      toast.error('Payment initiation failed. Please try again.')
    },
  })

  const isProcessing = payMutation.isPending || callbackMutation.isPending

  const onSubmit = (values: FormValues) => {
    if (!subscription || isProcessing) return
    payMutation.mutate({
      subscriptionId: subscription._id,
      phoneNumber: values.phoneNumber,
    })
  }

  if (!subscription) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-[#0D1B2A] text-xl font-bold">
            Complete Payment
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Enter your M-Pesa phone number to receive the STK push for{' '}
            <b>{subscription.name}</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 my-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 lowercase">
              Plan Summary
            </span>
            <span className="text-sm font-bold text-[#0D1B2A]">
              KSH {subscription.price.toLocaleString()}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-[#0D1B2A]">
                    M-Pesa Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 254708374149"
                      {...field}
                      className="h-12 text-lg tracking-wider focus:ring-[#0D1B2A] border-gray-200"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-gray-400">
                    Format: 254XXXXXXXXX (12 digits)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isProcessing}
                className="h-12"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#0D1B2A] text-white hover:bg-[#1A3A5C] h-12 flex-1 relative overflow-hidden"
                disabled={isProcessing}
              >
                {payMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending STK Push...
                  </>
                ) : callbackMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  `Pay KSH ${subscription.price.toLocaleString()}`
                )}
              </Button>
            </DialogFooter>

            {isProcessing && (
              <p className="text-[10px] text-center text-gray-400 animate-pulse mt-2">
                This may take a few seconds...
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

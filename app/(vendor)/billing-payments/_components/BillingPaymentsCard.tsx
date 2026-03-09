/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CreditCard, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../../_components/Header";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

function BillingPaymentsCard() {
  const session = useSession();
  const TOKEN = session?.data?.user?.accessToken;

  // profile data
  const { data: overviewBilling } = useQuery({
    queryKey: ["billing", TOKEN],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );

      const data = await res.json();
      return data?.data || data;
    },
  });

  // payment data
  const { data: myPayment } = useQuery({
    queryKey: ["payment", TOKEN],
    enabled: !!TOKEN,
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/my`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });

      const data = await res.json();
      return data;
    },
  });

  // plan info
  const planName = overviewBilling?.subscribers?.name || "No Plan";
  const planPrice = overviewBilling?.subscribers?.price
    ? `$${overviewBilling.subscribers.price}`
    : "$0";

  // subscription end date
  const endDate = overviewBilling?.subscriptionEndDate
    ? new Date(overviewBilling.subscriptionEndDate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      )
    : "No Date";

  // total payment amount
  const totalSpent =
    myPayment?.data?.reduce(
      (sum: number, item: any) => sum + (item.amount || 0),
      0
    ) || 0;

  const stats = [
    {
      icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
      title: planName,
      subtitle: `${planPrice} (Current Plan)`,
    },
    {
      icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
      title: endDate,
      subtitle: "Subscription End Date",
    },
    {
      icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
      title: `$${totalSpent}`,
      subtitle: "Total Spent",
    },
  ];

  return (
    <div>
      <Header
        title="Billing and Payments"
        subtitle="Manage your subscription and payment methods"
      />

      <div className="grid grid-cols-3 gap-4 p-6">
        {stats.map((item, index) => (
          <Card key={index} className="rounded-2xl shadow-sm border">
            <CardContent className="p-5 space-y-3">
              <div>{item.icon}</div>
              <div>
                <p className="text-base font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BillingPaymentsCard;
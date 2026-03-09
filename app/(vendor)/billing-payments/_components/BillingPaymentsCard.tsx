import { CreditCard, Calendar, DollarSign } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Header from "../../_components/Header";

const stats = [
  {
    icon: <CreditCard className="h-5 w-5 text-muted-foreground" />,
    title: "Professional",
    subtitle: "$499/month (Current Plan)",
  },
  {
    icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
    title: "Mar 1, 2026",
    subtitle: "Auto-renewal enabled",
  },
  {
    icon: <DollarSign className="h-5 w-5 text-muted-foreground" />,
    title: "$1,348",
    subtitle: "Total Spent (2026)",
  },
];

function BillingPaymentsCard() {
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

import { Zap, Star, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    name: "Starter",
    price: "KSH 199",
    period: "/7 days",
    popular: false,
    features: [
      "Highlighted in search results",
      "Display in 'Featured' section",
      "Priority placement for 7 days",
      "Standard visibility boost",
    ],
  },
  {
    icon: <Star className="h-5 w-5 text-white" />,
    name: "Professional",
    price: "KSH 499",
    period: "/1 month",
    popular: true,
    features: [
      "Top placement in search results",
      "Featured on homepage",
      "Social media promotion",
      "Priority visibility for 14 days",
      "Enhanced listing badge",
    ],
  },
  {
    icon: <Crown className="h-5 w-5 text-yellow-500" />,
    name: "Enterprise",
    price: "KSH 999",
    period: "/1year",
    popular: false,
    features: [
      "Maximum visibility",
      "Homepage hero placement",
      "Social media & email marketing",
      "Featured for 30 days",
    ],
  },
];

function BillingPaymentsPlan() {
  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold">Subscription Plans</h2>
      <p className="text-sm text-muted-foreground mb-6">Upgrade or downgrade your plan anytime</p>

      <div className="grid grid-cols-3 gap-4 items-center">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative rounded-2xl border transition-all ${
              plan.popular
                ? " text-black border-[#0F172A] scale-105 shadow-xl z-10"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-[#1E293B] text-white text-xs px-3 py-1 rounded-full border border-gray-600">
                  Most Popular
                </Badge>
              </div>
            )}

            <CardContent className="p-6 space-y-5">
              {/* Icon + Name */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  plan.popular ? "bg-white/10" : "bg-yellow-50"
                }`}>
                  {plan.icon}
                </div>
                <span className={`font-semibold text-base ${plan.popular ? "text-white" : "text-gray-800"}`}>
                  {plan.name}
                </span>
              </div>

              {/* Price */}
              <div>
                <span className={`text-3xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? "text-gray-300" : "text-muted-foreground"}`}>
                  {plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Zap className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.popular ? "text-blue-400" : "text-blue-500"}`} />
                    <span className={`text-sm ${plan.popular ? "text-gray-300" : "text-gray-600"}`}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <Button
                className={`w-full rounded-xl font-semibold mt-2 ${
                  plan.popular
                    ? "bg-white text-[#0F172A] hover:bg-gray-100"
                    : "bg-transparent border border-yellow-400 text-yellow-500 hover:bg-yellow-50"
                }`}
                variant="outline"
              >
                Buy Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default BillingPaymentsPlan;
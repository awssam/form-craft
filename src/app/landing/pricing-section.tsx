import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckIcon } from '@radix-ui/react-icons';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Up to 3 forms',
      '100 submissions per month',
      'Basic form templates',
      'Email notifications',
      'Form analytics',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    description: 'For professionals and growing teams',
    features: [
      'Unlimited forms',
      '5,000 submissions per month',
      'All form templates',
      'Advanced conditional logic',
      'File uploads',
      'Google Sheets & Airtable integration',
      'Custom webhooks',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with specific needs',
    features: [
      'Unlimited forms & submissions',
      'Custom branding',
      'Advanced security features',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantees',
      'Team collaboration tools',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Simple, Transparent Pricing</h2>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <p className="text-gray-300">Choose the plan that's right for you. All plans include a 14-day free trial.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            className={`bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all relative ${
              plan.popular ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-0 right-0 flex justify-center">
                <Badge className="bg-gradient-to-r from-blue-600 to-teal-500 text-white">Most Popular</Badge>
              </div>
            )}
            <CardHeader className="pb-2 pt-8">
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-300 ml-1">{plan.period}</span>}
              </div>
              <p className="text-sm text-gray-300 mt-2">{plan.description}</p>
            </CardHeader>
            <CardContent className="py-4">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                    <span className="text-gray-200 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                }`}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

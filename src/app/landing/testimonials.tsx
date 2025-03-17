import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote:
      "FormCraft has completely transformed how we collect data. The conditional logic feature alone has saved us countless hours of manual work.",
    author: "Sarah Johnson",
    title: "Marketing Director, TechCorp",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 2,
    quote:
      "The analytics dashboard gives us insights we never had before. We can now see exactly where users drop off and optimize our forms accordingly.",
    author: "Michael Chen",
    title: "Product Manager, DataFlow",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    id: 3,
    quote:
      "As a non-technical person, I was able to create complex multi-page forms in minutes. The templates are a great starting point!",
    author: "Emily Rodriguez",
    title: "HR Specialist, GrowthCo",
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export default function Testimonials() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">What Our Users Say</h2>
        <p className="text-gray-300">
          Join thousands of satisfied customers who have transformed their form experience with FormCraft.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-blue-500/5"
          >
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-blue-500/40 mb-4" />
              <p className="text-gray-200 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-medium text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-300">{testimonial.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


import type { Metadata } from "next"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { faqJsonLd } from "@/seo/jsonld"
import { buildMetadata } from "@/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "FAQ",
  description: "Answers to common questions about dining at Miss Ginko.",
  path: "/faq",
})

const faqs = [
  {
    question: "Do you accommodate dietary restrictions?",
    answer:
      "Yes. Every dish lists its allergens and dietary tags on our menu page, and our kitchen can adapt most courses for common restrictions with advance notice at booking.",
  },
  {
    question: "Is there a dress code?",
    answer: "Smart casual is recommended. We ask that guests avoid athletic wear and beachwear.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "We recommend booking 2–3 weeks ahead for weekend evenings, and 4–6 weeks for parties of six or more or the chef's table.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Reservations can be changed or cancelled up to 24 hours in advance at no charge. Late cancellations may incur a fee for parties of six or more.",
  },
  {
    question: "Do you host private events?",
    answer:
      "Yes — from intimate celebrations to full-room buyouts. Visit our Private Events page or contact our events team directly.",
  },
  {
    question: "Is parking available?",
    answer:
      "Complimentary valet is available Friday and Saturday evenings. Metered street parking and nearby public garages are available on all other nights.",
  },
]

export default function FaqPage() {
  return (
    <div className="bg-background pt-32 pb-28 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs.map((f) => ({ question: f.question, answer: f.answer })))) }}
      />

      <div className="container-editorial max-w-3xl">
        <span className="text-xs font-medium tracking-[0.3em] text-primary uppercase">FAQ</span>
        <h1 className="mt-4 font-display text-[clamp(2.5rem,2rem+3vw,5rem)] leading-[0.95] font-light">
          Frequently Asked
        </h1>

        <Accordion className="mt-14">
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`item-${index}`}>
              <AccordionTrigger className="py-6 font-display text-xl font-light hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-[15px] text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <p className="mt-12 text-sm text-muted-foreground">
          Still have questions?{" "}
          <a href="/contact" className="text-foreground underline underline-offset-4">
            Contact us
          </a>{" "}
          and we&apos;ll get back to you within one business day.
        </p>
      </div>
    </div>
  )
}

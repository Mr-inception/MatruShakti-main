import React from 'react';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { useToast } from "../hooks/use-toast";

interface Scheme {
  id: number;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applicationProcess: string;
  category: string;
  applicationLink: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  deadline: string; // ISO date string
  testimonials: { name: string; story: string }[];
  faqs: { question: string; answer: string }[];
}

const schemes: Scheme[] = [
  {
    id: 1,
    title: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    description: "A maternity benefit program that provides financial assistance to pregnant women and lactating mothers.",
    eligibility: [
      "First live birth",
      "Age 19 years and above",
      "Registered at AWC/Health facility"
    ],
    benefits: [
      "₹5,000 in three installments",
      "Direct bank transfer",
      "Additional nutritional support"
    ],
    documents: [
      "Aadhar Card",
      "Bank Account Details",
      "MCP Card"
    ],
    applicationProcess: "Apply through your local Anganwadi Center or visit the nearest health facility.",
    category: "Financial Assistance",
    applicationLink: "https://pmmvy.gov.in/apply",
    contact: {
      name: "Scheme Helpline",
      phone: "+91-1800-123-456",
      email: "support@pmmvy.gov.in"
    },
    deadline: "2024-12-31",
    testimonials: [
      { name: "Sita Devi", story: "I received timely support during my pregnancy. The process was smooth and the funds helped a lot." }
    ],
    faqs: [
      { question: "Who can apply?", answer: "Pregnant women for their first live birth, aged 19 and above." },
      { question: "How is the money disbursed?", answer: "Directly to the beneficiary's bank account in three installments." }
    ]
  },
  {
    id: 2,
    title: "Janani Suraksha Yojana (JSY)",
    description: "A safe motherhood intervention scheme that promotes institutional delivery among pregnant women.",
    eligibility: [
      "Below Poverty Line",
      "Age 19 years and above",
      "Up to two live births"
    ],
    benefits: [
      "Cash assistance for delivery",
      "Free ante-natal check-ups",
      "Transportation support"
    ],
    documents: [
      "BPL Certificate",
      "Aadhar Card",
      "Bank Account Details"
    ],
    applicationProcess: "Register at your nearest government health facility or through ASHA worker.",
    category: "Healthcare",
    applicationLink: "https://jsy.gov.in/apply",
    contact: {
      name: "JSY Support",
      phone: "+91-1800-654-321",
      email: "help@jsy.gov.in"
    },
    deadline: "2024-11-15",
    testimonials: [
      { name: "Radha Kumari", story: "The scheme covered my delivery expenses and the hospital staff were very helpful." }
    ],
    faqs: [
      { question: "Is there a limit on the number of births?", answer: "Yes, up to two live births are covered." },
      { question: "How to check application status?", answer: "Contact your ASHA worker or check online using your registration number." }
    ]
  },
  {
    id: 3,
    title: "Pradhan Mantri Surakshit Matritva Abhiyan (PMSMA)",
    description: "Provides fixed-day assured, comprehensive and quality antenatal care to pregnant women.",
    eligibility: [
      "All pregnant women",
      "In 2nd/3rd trimester"
    ],
    benefits: [
      "Free health check-ups",
      "Required medical tests",
      "Expert consultation"
    ],
    documents: [
      "Any Government ID",
      "MCP Card"
    ],
    applicationProcess: "Visit designated health facility on 9th of every month.",
    category: "Healthcare",
    applicationLink: "https://pmsma.gov.in/apply",
    contact: {
      name: "PMSMA Helpline",
      phone: "+91-1800-789-123",
      email: "info@pmsma.gov.in"
    },
    deadline: "2024-10-09",
    testimonials: [
      { name: "Meena Sharma", story: "The free check-ups and expert advice made my pregnancy journey safe and stress-free." }
    ],
    faqs: [
      { question: "When are the check-ups held?", answer: "On the 9th of every month at designated health facilities." },
      { question: "Is there any cost?", answer: "No, all services under PMSMA are free of charge." }
    ]
  }
];

// Simulate application status per scheme (in a real app, this would be user-specific and persisted)
const initialStatus: Record<number, string> = {
  1: "Not Applied",
  2: "In Progress",
  3: "Approved"
};

export default function Schemes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [status, setStatus] = useState<Record<number, string>>(initialStatus);
  const [notify, setNotify] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const categories = Array.from(new Set(schemes.map(scheme => scheme.category)));

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    setStatus(prev => ({ ...prev, [id]: newStatus }));
  };

  const handleNotifyToggle = (id: number) => {
    setNotify(prev => {
      const newNotify = { ...prev, [id]: !prev[id] };
      if (newNotify[id]) {
        toast({
          title: "Notifications Enabled",
          description: `You will be notified before the deadline for this scheme.`
        });
      }
      return newNotify;
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Government Schemes</h1>
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search schemes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-1/2"
          />
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!selectedCategory ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="h-full flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{scheme.title}</CardTitle>
                  <Badge>{scheme.category}</Badge>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xs text-gray-500">Deadline: {new Date(scheme.deadline).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={!!notify[scheme.id]}
                      onCheckedChange={() => handleNotifyToggle(scheme.id)}
                      id={`notify-${scheme.id}`}
                    />
                    <label htmlFor={`notify-${scheme.id}`} className="text-xs">Notify me</label>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="mb-4">{scheme.description}</CardDescription>
              <Accordion type="single" collapsible>
                <AccordionItem value="eligibility">
                  <AccordionTrigger>Eligibility Criteria</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4">
                      {scheme.eligibility.map((criteria, index) => (
                        <li key={index}>{criteria}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="benefits">
                  <AccordionTrigger>Benefits</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4">
                      {scheme.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="documents">
                  <AccordionTrigger>Required Documents</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4">
                      {scheme.documents.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="process">
                  <AccordionTrigger>How to Apply</AccordionTrigger>
                  <AccordionContent>
                    <p>{scheme.applicationProcess}</p>
                    <a
                      href={scheme.applicationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-blue-600 underline"
                    >
                      Apply Online
                    </a>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="status">
                  <AccordionTrigger>Application Status</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Status:</span>
                      <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">{status[scheme.id]}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(scheme.id, "Not Applied")}>Not Applied</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(scheme.id, "In Progress")}>In Progress</Button>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(scheme.id, "Approved")}>Approved</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="contact">
                  <AccordionTrigger>Contact Information</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1">
                      <div><span className="font-medium">Name:</span> {scheme.contact.name}</div>
                      <div><span className="font-medium">Phone:</span> {scheme.contact.phone}</div>
                      <div><span className="font-medium">Email:</span> <a href={`mailto:${scheme.contact.email}`} className="text-blue-600 underline">{scheme.contact.email}</a></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="testimonials">
                  <AccordionTrigger>Success Stories / Testimonials</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {scheme.testimonials.map((t, idx) => (
                        <li key={idx} className="border-l-4 border-green-400 pl-2 italic">"{t.story}"<br /><span className="text-xs font-semibold">- {t.name}</span></li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faqs">
                  <AccordionTrigger>FAQs</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {scheme.faqs.map((faq, idx) => (
                        <li key={idx}>
                          <span className="font-semibold">Q: {faq.question}</span><br />
                          <span>A: {faq.answer}</span>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface Scheme {
  id: number;
  title: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  documents: string[];
  applicationProcess: string;
  category: string;
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
    category: "Financial Assistance"
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
    category: "Healthcare"
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
    category: "Healthcare"
  }
];

export default function Schemes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(schemes.map(scheme => scheme.category)));

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || scheme.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <Card key={scheme.id} className="h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-2">{scheme.title}</CardTitle>
                  <Badge>{scheme.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
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
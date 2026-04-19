"use client";

import Button from "@/components/Button";

export default function ButtonShowcase() {
  return (
    <div className="space-y-8">
      {/* Sizes */}
      <div className="space-y-2">
        <p className="font-body text-xs uppercase tracking-widest text-espresso/40 mb-4">
          Primary — all sizes
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg">Large</Button>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-2">
        <p className="font-body text-xs uppercase tracking-widest text-espresso/40 mb-4">
          Variants
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      {/* CTA examples */}
      <div className="space-y-2">
        <p className="font-body text-xs uppercase tracking-widest text-espresso/40 mb-4">
          Real-world CTAs
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" size="lg">
            Explore Tools →
          </Button>
          <Button variant="secondary" size="lg">
            See all signal
          </Button>
          <Button variant="ghost" size="md">
            See all categories
          </Button>
        </div>
      </div>
    </div>
  );
}

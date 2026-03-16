"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Layers,
  Wrench,
  Sun,
  User,
  Check,
  ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormData {
  // Step 1 — Address
  address: string;
  city: string;
  state: string;
  zip: string;
  // Step 2 — Property basics
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  sqft: string;
  lotSize: string;
  yearBuilt: string;
  // Step 3 — Condition & features
  condition: string;
  garage: string;
  pool: boolean;
  view: boolean;
  solar: boolean;
  adUnit: boolean;
  // Step 4 — Recent updates
  kitchenUpdate: string;
  bathroomUpdate: string;
  roofUpdate: string;
  hvacUpdate: string;
  // Step 5 — Seller context
  timeline: string;
  reason: string;
  agentRelationship: string;
  // Step 6 — Contact
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const INITIAL: FormData = {
  address: "", city: "", state: "CA", zip: "",
  propertyType: "", bedrooms: "", bathrooms: "", sqft: "", lotSize: "", yearBuilt: "",
  condition: "", garage: "", pool: false, view: false, solar: false, adUnit: false,
  kitchenUpdate: "", bathroomUpdate: "", roofUpdate: "", hvacUpdate: "",
  timeline: "", reason: "", agentRelationship: "",
  firstName: "", lastName: "", phone: "", email: "",
};

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Address",   icon: <Home className="w-4 h-4" /> },
  { id: 2, label: "Details",   icon: <Layers className="w-4 h-4" /> },
  { id: 3, label: "Features",  icon: <Sun className="w-4 h-4" /> },
  { id: 4, label: "Updates",   icon: <Wrench className="w-4 h-4" /> },
  { id: 5, label: "Timeline",  icon: <Home className="w-4 h-4" /> },
  { id: 6, label: "Contact",   icon: <User className="w-4 h-4" /> },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function Select({
  label, name, value, onChange, options, placeholder,
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-mk-teal-light focus:ring-2 focus:ring-mk-teal-light/20 transition-all"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function Input({
  label, name, value, onChange, placeholder, type = "text",
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-mk-teal-light focus:ring-2 focus:ring-mk-teal-light/20 transition-all placeholder:text-gray-400"
      />
    </div>
  );
}

function Toggle({
  label, checked, onChange, desc,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void; desc?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-start gap-3 p-4 rounded-xl border transition-all text-left ${
        checked
          ? "border-mk-teal-light bg-mk-mint"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
          checked ? "bg-mk-teal border-mk-teal" : "border-gray-300"
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <div>
        <span className="text-sm font-medium text-gray-900 block">{label}</span>
        {desc && <span className="text-xs text-gray-500">{desc}</span>}
      </div>
    </button>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      <Input label="Street Address" name="address" value={data.address} onChange={(v) => set("address", v)} placeholder="123 Oak Ridge Drive" />
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="City" name="city" value={data.city} onChange={(v) => set("city", v)} placeholder="Thousand Oaks" />
        <Input label="ZIP Code" name="zip" value={data.zip} onChange={(v) => set("zip", v)} placeholder="91360" />
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      <Select label="Property Type" name="propertyType" value={data.propertyType} onChange={(v) => set("propertyType", v)}
        options={["Single Family Home", "Condo / Townhome", "Multi-Family (2–4 units)", "Land / Lot"]}
        placeholder="Select property type" />
      <div className="grid sm:grid-cols-3 gap-4">
        <Select label="Bedrooms" name="bedrooms" value={data.bedrooms} onChange={(v) => set("bedrooms", v)}
          options={["1", "2", "3", "4", "5", "6+"]} placeholder="Beds" />
        <Select label="Bathrooms" name="bathrooms" value={data.bathrooms} onChange={(v) => set("bathrooms", v)}
          options={["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5+"]} placeholder="Baths" />
        <Input label="Year Built" name="yearBuilt" value={data.yearBuilt} onChange={(v) => set("yearBuilt", v)} placeholder="1995" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Living Area (sqft)" name="sqft" value={data.sqft} onChange={(v) => set("sqft", v)} placeholder="2,100" />
        <Input label="Lot Size (sqft)" name="lotSize" value={data.lotSize} onChange={(v) => set("lotSize", v)} placeholder="7,500" />
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      <Select label="Overall Condition" name="condition" value={data.condition} onChange={(v) => set("condition", v)}
        options={["Excellent — like new / recently renovated", "Good — well maintained, minor wear", "Fair — needs some updating", "Needs Work — significant repairs needed"]}
        placeholder="Select condition" />
      <Select label="Garage" name="garage" value={data.garage} onChange={(v) => set("garage", v)}
        options={["None", "1-Car Garage", "2-Car Garage", "3-Car Garage", "Carport"]}
        placeholder="Select garage type" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
          Additional Features
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <Toggle label="Swimming Pool" desc="In-ground pool on property" checked={data.pool} onChange={(v) => set("pool", v)} />
          <Toggle label="View" desc="Mountain, canyon, or city view" checked={data.view} onChange={(v) => set("view", v)} />
          <Toggle label="Solar Panels" desc="Owned solar system installed" checked={data.solar} onChange={(v) => set("solar", v)} />
          <Toggle label="ADU / Guest House" desc="Accessory dwelling unit on lot" checked={data.adUnit} onChange={(v) => set("adUnit", v)} />
        </div>
      </div>
    </div>
  );
}

function Step4({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  const updateOptions = ["Within the last year", "1–5 years ago", "5–10 years ago", "10+ years ago / original"];
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">Recent updates significantly affect your home&apos;s value. Tell us about any major work.</p>
      <Select label="Kitchen Update" name="kitchenUpdate" value={data.kitchenUpdate} onChange={(v) => set("kitchenUpdate", v)} options={updateOptions} placeholder="Select timeframe" />
      <Select label="Bathroom Update(s)" name="bathroomUpdate" value={data.bathroomUpdate} onChange={(v) => set("bathroomUpdate", v)} options={updateOptions} placeholder="Select timeframe" />
      <Select label="Roof" name="roofUpdate" value={data.roofUpdate} onChange={(v) => set("roofUpdate", v)} options={updateOptions} placeholder="Select timeframe" />
      <Select label="HVAC / Heating & Cooling" name="hvacUpdate" value={data.hvacUpdate} onChange={(v) => set("hvacUpdate", v)} options={updateOptions} placeholder="Select timeframe" />
    </div>
  );
}

function Step5({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      <Select label="When are you thinking of selling?" name="timeline" value={data.timeline} onChange={(v) => set("timeline", v)}
        options={["ASAP / within 3 months", "3–6 months", "6–12 months", "1–2 years", "Just exploring / no set timeline"]}
        placeholder="Select your timeline" />
      <Select label="Primary reason for selling" name="reason" value={data.reason} onChange={(v) => set("reason", v)}
        options={["Upsizing / growing family", "Downsizing", "Relocating", "Investment / portfolio optimization", "Estate / inherited property", "Divorce / life change", "Other"]}
        placeholder="Select reason" />
      <Select label="Are you currently working with an agent?" name="agentRelationship" value={data.agentRelationship} onChange={(v) => set("agentRelationship", v)}
        options={["No — I'm open to representation", "No — I plan to sell myself (FSBO)", "Yes — I have an agent", "Just researching for now"]}
        placeholder="Select one" />
    </div>
  );
}

function Step6({ data, set }: { data: FormData; set: (k: keyof FormData, v: string | boolean) => void }) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Almost there! Enter your contact details to receive your personalized home valuation report.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="First Name" name="firstName" value={data.firstName} onChange={(v) => set("firstName", v)} placeholder="Michael" />
        <Input label="Last Name" name="lastName" value={data.lastName} onChange={(v) => set("lastName", v)} placeholder="Mathias" />
      </div>
      <Input label="Phone Number" name="phone" value={data.phone} onChange={(v) => set("phone", v)} placeholder="(805) 555-0100" type="tel" />
      <Input label="Email Address" name="email" value={data.email} onChange={(v) => set("email", v)} placeholder="you@example.com" type="email" />
      <p className="text-xs text-gray-400 leading-relaxed">
        By submitting, you agree to receive communications from MasterKey Real Estate.
        We will never sell your information. View our{" "}
        <a href="#" className="underline hover:text-mk-teal">privacy policy</a>.
      </p>
    </div>
  );
}

// ─── Validation ───────────────────────────────────────────────────────────────

function isStepValid(step: number, data: FormData): boolean {
  switch (step) {
    case 1: return !!data.address.trim() && !!data.city.trim() && !!data.zip.trim();
    case 2: return !!data.propertyType && !!data.bedrooms && !!data.bathrooms && !!data.sqft && !!data.yearBuilt;
    case 3: return !!data.condition && !!data.garage;
    case 4: return !!data.kitchenUpdate && !!data.bathroomUpdate && !!data.roofUpdate && !!data.hvacUpdate;
    case 5: return !!data.timeline && !!data.reason && !!data.agentRelationship;
    case 6: return !!data.firstName.trim() && !!data.lastName.trim() && !!data.phone.trim() && !!data.email.trim();
    default: return false;
  }
}

// ─── Main Quiz component ──────────────────────────────────────────────────────

export default function HomeValueQuiz() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(INITIAL);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const cardRef = useRef<HTMLDivElement>(null);

  function set(key: keyof FormData, value: string | boolean) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function navigate(next: number) {
    setDirection(next > step ? "forward" : "back");
    setAnimating(true);
    setTimeout(() => {
      setStep(next);
      setAnimating(false);
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 220);
  }

  function handleSubmit() {
    if (!isStepValid(6, data)) return;
    // Store in sessionStorage for the results page to read
    sessionStorage.setItem("hv_data", JSON.stringify(data));
    router.push("/homevalue/results");
  }

  const valid = isStepValid(step, data);
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1 data={data} set={set} />,
    2: <Step2 data={data} set={set} />,
    3: <Step3 data={data} set={set} />,
    4: <Step4 data={data} set={set} />,
    5: <Step5 data={data} set={set} />,
    6: <Step6 data={data} set={set} />,
  };

  const stepTitles: Record<number, { heading: string; sub: string }> = {
    1: { heading: "Let's start with your property address", sub: "Enter the address of the home you'd like to value." },
    2: { heading: "Tell us about your property", sub: "Basic details help us find accurate comparable sales." },
    3: { heading: "Features & condition", sub: "These factors can significantly affect your home's value." },
    4: { heading: "Any recent updates?", sub: "Renovations and replacements boost your estimate." },
    5: { heading: "What's your selling timeline?", sub: "Helps us tailor your report and market strategy." },
    6: { heading: "Almost there — where should we send your report?", sub: "Your valuation is ready the moment you submit." },
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-mk-cream pt-[88px] pb-20">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6">
          {/* Progress bar */}
          <div className="mb-8 pt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                Step {step} of {STEPS.length}
              </span>
              <span className="text-xs text-gray-400">{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-mk-teal rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Step pills */}
            <div className="flex items-center justify-between mt-3">
              {STEPS.map((s) => (
                <div key={s.id} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 text-xs ${
                      s.id < step
                        ? "bg-mk-teal text-white"
                        : s.id === step
                        ? "bg-mk-teal text-white ring-4 ring-mk-teal/20"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {s.id < step ? <Check className="w-3.5 h-3.5" /> : s.id}
                  </div>
                  <span className="text-[10px] text-gray-400 hidden sm:block">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card */}
          <div
            ref={cardRef}
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 transition-all duration-200 ${
              animating
                ? direction === "forward"
                  ? "opacity-0 translate-x-4"
                  : "opacity-0 -translate-x-4"
                : "opacity-100 translate-x-0"
            }`}
          >
            <div className="mb-6">
              <h2 className="font-display text-2xl sm:text-[1.75rem] text-gray-900 leading-snug">
                {stepTitles[step].heading}
              </h2>
              <p className="text-sm text-gray-500 mt-2">{stepTitles[step].sub}</p>
            </div>

            {stepComponents[step]}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  onClick={() => navigate(step - 1)}
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-mk-teal transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < STEPS.length ? (
                <button
                  onClick={() => navigate(step + 1)}
                  disabled={!valid}
                  className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all ${
                    valid
                      ? "bg-mk-teal text-white hover:bg-mk-teal/90 shadow-lg shadow-mk-teal/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!valid}
                  className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all ${
                    valid
                      ? "bg-mk-teal text-white hover:bg-mk-teal/90 shadow-lg shadow-mk-teal/20"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Get my valuation <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Trust line */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Your information is secure and never sold. Licensed CA brokerage · DRE #XXXXXXX
          </p>
        </div>
      </main>
    </>
  );
}

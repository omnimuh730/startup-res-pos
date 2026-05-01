import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { User, Mail, Lock, Phone, MapPin, CreditCard, Calendar, Upload, Eye, EyeOff, Check } from "lucide-react";

export function FormsSection() {
  const [showPw, setShowPw] = useState(false);

  return (
    <SectionWrapper
      id="forms"
      title="Form Layouts"
      description="Complete form patterns including sign-up, contact, checkout, profile, and settings forms with proper validation states."
    >
      <ComponentCard title="Sign Up Form">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-[1.25rem]">Create an account</h3>
            <p className="text-[0.8125rem] text-muted-foreground mt-1">Start your 14-day free trial</p>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.8125rem] block mb-1">First name</label>
                <input type="text" placeholder="John" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="text-[0.8125rem] block mb-1">Last name</label>
                <input type="text" placeholder="Doe" className="w-full px-3 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" placeholder="john@example.com" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPw ? "text" : "password"} placeholder="Min. 8 characters" className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? "bg-success" : "bg-border"}`} />
                ))}
              </div>
              <p className="text-[0.6875rem] text-success mt-1">Strong password</p>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 mt-0.5 accent-primary cursor-pointer" />
              <span className="text-[0.8125rem] text-muted-foreground">
                I agree to the <span className="text-primary underline cursor-pointer">Terms of Service</span> and <span className="text-primary underline cursor-pointer">Privacy Policy</span>
              </span>
            </label>
            <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer">
              Create Account
            </button>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[0.75rem] text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <button className="w-full py-2.5 border border-border rounded-lg hover:bg-secondary transition-colors cursor-pointer text-[0.875rem]">
              Continue with Google
            </button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Contact Form">
        <div className="max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="text-[0.8125rem] block mb-1">Full name</label>
              <input type="text" placeholder="Your full name" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[0.8125rem] block mb-1">Email</label>
                <input type="email" placeholder="you@email.com" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="text-[0.8125rem] block mb-1">Phone (optional)</label>
                <input type="tel" placeholder="+1 (555) 000-0000" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-1">Subject</label>
              <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none appearance-none cursor-pointer">
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Billing</option>
                <option>Partnership</option>
              </select>
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-1">Message</label>
              <textarea rows={4} placeholder="How can we help?" className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-1">Attachment</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-[0.8125rem] text-muted-foreground">Drop files here or <span className="text-primary">browse</span></p>
                <p className="text-[0.6875rem] text-muted-foreground mt-1">Max 10MB, PDF, PNG, JPG</p>
              </div>
            </div>
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">
              Send Message
            </button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Checkout / Payment Form">
        <div className="max-w-lg">
          <div className="space-y-5">
            <div>
              <h4 className="text-[0.9375rem] mb-3">Shipping Information</h4>
              <div className="space-y-3">
                <input type="text" placeholder="Full name" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                <input type="text" placeholder="Address line 1" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                <input type="text" placeholder="Address line 2 (optional)" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" placeholder="City" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  <input type="text" placeholder="State" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  <input type="text" placeholder="ZIP" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div>
              <h4 className="text-[0.9375rem] mb-3">Payment Details</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[0.8125rem] block mb-1">Card number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[0.8125rem] block mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="text-[0.8125rem] block mb-1">CVC</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-secondary rounded-xl p-4 space-y-2 text-[0.8125rem]">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>$199.00</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>$9.99</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>$16.72</span></div>
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between text-[0.9375rem]"><span>Total</span><span>$225.71</span></div>
            </div>
            <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">
              Pay $225.71
            </button>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Profile / Settings Form">
        <div className="max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary text-[1.25rem]">
              JD
            </div>
            <div>
              <p className="text-[0.9375rem]">John Doe</p>
              <button className="text-[0.8125rem] text-primary cursor-pointer hover:underline">Change photo</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.8125rem] block mb-1">First name</label>
                <input type="text" defaultValue="John" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
              <div>
                <label className="text-[0.8125rem] block mb-1">Last name</label>
                <input type="text" defaultValue="Doe" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-1">Email</label>
              <input type="email" defaultValue="john@company.com" className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-1">Bio</label>
              <textarea rows={3} defaultValue="Product designer based in San Francisco." className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" />
            </div>
            <div>
              <label className="text-[0.8125rem] block mb-2">Notifications</label>
              <div className="space-y-2.5">
                {[
                  { label: "Email notifications", checked: true },
                  { label: "Push notifications", checked: false },
                  { label: "SMS notifications", checked: true },
                ].map((n) => (
                  <label key={n.label} className="flex items-center justify-between cursor-pointer">
                    <span className="text-[0.8125rem]">{n.label}</span>
                    <input type="checkbox" defaultChecked={n.checked} className="w-4 h-4 accent-primary cursor-pointer" />
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 cursor-pointer">Save Changes</button>
              <button className="px-5 py-2.5 border border-border rounded-lg hover:bg-secondary cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Inline Edit / Settings">
        <div className="max-w-lg divide-y divide-border">
          {[
            { label: "Display name", value: "John Doe" },
            { label: "Email", value: "john@example.com" },
            { label: "Language", value: "English (US)" },
            { label: "Timezone", value: "Pacific Time (UTC-8)" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-[0.8125rem] text-muted-foreground">{item.label}</p>
                <p className="text-[0.875rem]">{item.value}</p>
              </div>
              <button className="text-[0.8125rem] text-primary hover:underline cursor-pointer">Edit</button>
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

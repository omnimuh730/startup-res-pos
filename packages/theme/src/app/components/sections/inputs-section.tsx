import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Search, Eye, EyeOff, Mail, Lock, User, Calendar } from "lucide-react";

export function InputsSection() {
  const [showPassword, setShowPassword] = useState(false);
  const [selected, setSelected] = useState("option1");
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <SectionWrapper
      id="inputs"
      title="Form Inputs"
      description="Form components designed for clarity and ease of use."
    >
      <ComponentCard title="Text Inputs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
          <div>
            <label className="text-[0.8125rem] block mb-1.5">Default</label>
            <input
              type="text"
              placeholder="Enter text..."
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[0.8125rem] block mb-1.5">With Icon</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[0.8125rem] block mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[0.8125rem] block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                defaultValue="password123"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-[0.8125rem] block mb-1.5 text-destructive">Error State</label>
            <input
              type="text"
              defaultValue="Invalid input"
              className="w-full px-4 py-2.5 rounded-lg border-2 border-destructive bg-background focus:ring-2 focus:ring-destructive/20 outline-none"
            />
            <p className="text-[0.75rem] text-destructive mt-1">This field is required.</p>
          </div>
          <div>
            <label className="text-[0.8125rem] block mb-1.5 text-muted-foreground">Disabled</label>
            <input
              type="text"
              placeholder="Disabled input"
              disabled
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Textarea">
        <div className="max-w-lg">
          <label className="text-[0.8125rem] block mb-1.5">Description</label>
          <textarea
            placeholder="Write something..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          />
          <p className="text-[0.75rem] text-muted-foreground mt-1">0 / 500 characters</p>
        </div>
      </ComponentCard>

      <ComponentCard title="Select">
        <div className="max-w-sm">
          <label className="text-[0.8125rem] block mb-1.5">Category</label>
          <select className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer">
            <option>Select an option</option>
            <option>Design</option>
            <option>Engineering</option>
            <option>Marketing</option>
          </select>
        </div>
      </ComponentCard>

      <ComponentCard title="Checkbox, Radio & Toggle">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="w-5 h-5 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-[0.875rem]">Checkbox</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded border-border accent-primary cursor-pointer" />
              <span className="text-[0.875rem]">Unchecked</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-not-allowed opacity-50">
              <input type="checkbox" disabled className="w-5 h-5 rounded border-border cursor-not-allowed" />
              <span className="text-[0.875rem]">Disabled</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-6">
            {["option1", "option2", "option3"].map((opt, i) => (
              <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="demo"
                  checked={selected === opt}
                  onChange={() => setSelected(opt)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
                <span className="text-[0.875rem]">Option {i + 1}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSwitchOn(!switchOn)}
              className={`relative w-12 h-7 rounded-full transition-colors cursor-pointer ${
                switchOn ? "bg-primary" : "bg-switch-background"
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  switchOn ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
            <span className="text-[0.875rem]">Toggle {switchOn ? "On" : "Off"}</span>
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

import { useState, useEffect } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { ProgressBar, StepProgress, CircularProgress } from "../ds";

export function ProgressBarSection() {
  const [animVal, setAnimVal] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimVal((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return (
    <SectionWrapper
      id="progress-ds"
      title="Progress Bar"
      description="Linear, circular, and step progress components with multiple variants, colors, sizes, and animated states."
    >
      <ComponentCard title="Basic">
        <div className="max-w-lg space-y-5">
          <ProgressBar value={25} showPercentage label="Downloads" />
          <ProgressBar value={60} showPercentage label="Storage Used" />
          <ProgressBar value={90} showPercentage label="Battery" />
        </div>
      </ComponentCard>

      <ComponentCard title="Variants">
        <div className="max-w-lg space-y-5">
          <ProgressBar value={65} variant="default" showPercentage label="Default" />
          <ProgressBar value={65} variant="striped" showPercentage label="Striped" />
          <ProgressBar value={65} variant="gradient" showPercentage label="Gradient" />
          <ProgressBar value={65} variant="segmented" showPercentage label="Segmented" />
        </div>
      </ComponentCard>

      <ComponentCard title="Colors">
        <div className="max-w-lg space-y-4">
          {(["primary", "success", "warning", "destructive", "info"] as const).map((color) => (
            <ProgressBar key={color} value={70} color={color} showPercentage label={color} />
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Sizes">
        <div className="max-w-lg space-y-5">
          {(["xs", "sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-1">size="{size}"</p>
              <ProgressBar value={55} size={size} />
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Large with Inner Label">
        <div className="max-w-lg space-y-4">
          <ProgressBar value={72} size="lg" showPercentage color="primary" />
          <ProgressBar value={45} size="lg" showPercentage color="success" />
        </div>
      </ComponentCard>

      <ComponentCard title="Animated">
        <div className="max-w-lg space-y-4">
          <ProgressBar value={animVal} showPercentage label="Auto-incrementing" />
          <ProgressBar value={animVal} variant="striped" showPercentage label="Striped Animated" />
          <ProgressBar value={animVal} variant="gradient" showPercentage label="Gradient Animated" color="info" />
        </div>
      </ComponentCard>

      <ComponentCard title="Step Progress">
        <div className="space-y-8">
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-3">Step 2 of 4</p>
            <StepProgress
              currentStep={2}
              steps={[
                { label: "Account", description: "Create account" },
                { label: "Profile", description: "Add details" },
                { label: "Payment", description: "Add card" },
                { label: "Confirm", description: "Review order" },
              ]}
            />
          </div>
          <div>
            <p className="text-[0.6875rem] text-muted-foreground font-mono mb-3">Step 1 of 3 (small)</p>
            <StepProgress
              currentStep={1}
              size="sm"
              steps={[
                { label: "Upload" },
                { label: "Process" },
                { label: "Complete" },
              ]}
            />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="Circular Progress">
        <div className="flex flex-wrap gap-6 items-end">
          {[
            { value: 25, color: "destructive" as const, label: "CPU" },
            { value: 55, color: "warning" as const, label: "RAM" },
            { value: 78, color: "success" as const, label: "Disk" },
            { value: 92, color: "primary" as const, label: "Network" },
          ].map((item) => (
            <div key={item.label} className="relative">
              <CircularProgress
                value={item.value}
                color={item.color}
                label={item.label}
              />
            </div>
          ))}
          <div className="relative">
            <CircularProgress value={animVal} size={100} strokeWidth={8} color="info" label="Live" />
          </div>
        </div>
      </ComponentCard>

      <ComponentCard title="In Context — File Upload">
        <div className="max-w-md p-4 rounded-xl border border-border space-y-4">
          {[
            { name: "design-system.fig", size: "12.4 MB", progress: 100, color: "success" as const },
            { name: "components.zip", size: "8.7 MB", progress: 72, color: "primary" as const },
            { name: "assets.tar.gz", size: "24.1 MB", progress: 35, color: "info" as const },
          ].map((file) => (
            <div key={file.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[0.8125rem]">{file.name}</span>
                  <span className="text-[0.6875rem] text-muted-foreground">{file.size}</span>
                </div>
                <span className="text-[0.75rem] text-muted-foreground">
                  {file.progress === 100 ? "Done" : `${file.progress}%`}
                </span>
              </div>
              <ProgressBar value={file.progress} size="sm" color={file.color} />
            </div>
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

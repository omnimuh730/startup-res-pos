import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { Pagination } from "../ds";

export function PaginationSection() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);
  const [page3, setPage3] = useState(1);

  return (
    <SectionWrapper
      id="pagination-ds"
      title="Pagination"
      description="Flexible pagination with default, outline, pill, and minimal variants. Supports first/last buttons, page info, sizes, and smart page range."
    >
      <ComponentCard title="Variants">
        <div className="space-y-6">
          {(["default", "outline", "pill", "minimal"] as const).map((variant) => (
            <div key={variant}>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">variant="{variant}"</p>
              <Pagination currentPage={page1} totalPages={10} onPageChange={setPage1} variant={variant} />
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="With First/Last & Page Info">
        <Pagination
          currentPage={page2}
          totalPages={20}
          onPageChange={setPage2}
          showFirstLast
          showPageInfo
          siblingCount={1}
        />
      </ComponentCard>

      <ComponentCard title="Sizes">
        <div className="space-y-6">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size}>
              <p className="text-[0.6875rem] text-muted-foreground font-mono mb-2">size="{size}"</p>
              <Pagination currentPage={3} totalPages={8} onPageChange={() => {}} size={size} />
            </div>
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Few Pages">
        <div className="space-y-4">
          <Pagination currentPage={page3} totalPages={3} onPageChange={setPage3} />
          <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} showPageInfo />
        </div>
      </ComponentCard>

      <ComponentCard title="Disabled">
        <Pagination currentPage={3} totalPages={10} onPageChange={() => {}} disabled />
      </ComponentCard>

      <ComponentCard title="In Context — Data Table Footer">
        <div className="p-4 rounded-xl border border-border">
          <div className="space-y-3 mb-4">
            {["Alice Johnson — alice@company.com", "Bob Smith — bob@company.com", "Carol White — carol@company.com"].map((row) => (
              <div key={row} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[0.75rem] text-muted-foreground">
                  {row[0]}
                </div>
                <span className="text-[0.8125rem]">{row}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[0.75rem] text-muted-foreground">Showing 1–3 of 47 results</p>
            <Pagination currentPage={1} totalPages={16} onPageChange={() => {}} size="sm" />
          </div>
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

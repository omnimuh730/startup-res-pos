import { useState } from "react";
import { SectionWrapper, ComponentCard } from "../section-wrapper";
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, FileCode, FileText, Image, Settings, Database, Code, Package } from "lucide-react";

interface TreeNode {
  id: string;
  label: string;
  icon?: React.ElementType;
  children?: TreeNode[];
  badge?: string;
}

const fileTree: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: Folder,
    children: [
      {
        id: "components",
        label: "components",
        icon: Folder,
        children: [
          { id: "btn", label: "Button.tsx", icon: FileCode, badge: "modified" },
          { id: "card", label: "Card.tsx", icon: FileCode },
          { id: "input", label: "Input.tsx", icon: FileCode },
          { id: "modal", label: "Modal.tsx", icon: FileCode, badge: "new" },
          { id: "idx", label: "index.ts", icon: File },
        ],
      },
      {
        id: "hooks",
        label: "hooks",
        icon: Folder,
        children: [
          { id: "useTheme", label: "useTheme.ts", icon: FileCode },
          { id: "useMedia", label: "useMediaQuery.ts", icon: FileCode },
        ],
      },
      {
        id: "styles",
        label: "styles",
        icon: Folder,
        children: [
          { id: "theme", label: "theme.css", icon: File, badge: "modified" },
          { id: "fonts", label: "fonts.css", icon: File },
        ],
      },
      {
        id: "assets",
        label: "assets",
        icon: Folder,
        children: [
          { id: "logo", label: "logo.svg", icon: Image },
          { id: "hero", label: "hero.png", icon: Image },
        ],
      },
      { id: "app", label: "App.tsx", icon: FileCode },
      { id: "main", label: "main.tsx", icon: FileCode },
    ],
  },
  { id: "pkg", label: "package.json", icon: Package },
  { id: "tsconfig", label: "tsconfig.json", icon: Settings },
  { id: "readme", label: "README.md", icon: FileText },
];

const orgTree: TreeNode[] = [
  {
    id: "company",
    label: "Acme Corp",
    children: [
      {
        id: "eng",
        label: "Engineering",
        badge: "12",
        children: [
          {
            id: "frontend",
            label: "Frontend",
            badge: "5",
            children: [
              { id: "alice", label: "Alice Chen" },
              { id: "bob", label: "Bob Kim" },
              { id: "carol", label: "Carol Wu" },
            ],
          },
          {
            id: "backend",
            label: "Backend",
            badge: "4",
            children: [
              { id: "dave", label: "Dave Park" },
              { id: "eve", label: "Eve Lee" },
            ],
          },
          {
            id: "infra",
            label: "Infrastructure",
            badge: "3",
            children: [
              { id: "frank", label: "Frank Zhu" },
            ],
          },
        ],
      },
      {
        id: "design",
        label: "Design",
        badge: "6",
        children: [
          { id: "grace", label: "Grace Liu" },
          { id: "henry", label: "Henry Ma" },
        ],
      },
      {
        id: "product",
        label: "Product",
        badge: "4",
        children: [
          { id: "ivy", label: "Ivy Wang" },
        ],
      },
    ],
  },
];

function TreeItem({
  node,
  level = 0,
  variant = "file",
}: {
  node: TreeNode;
  level?: number;
  variant?: "file" | "org";
}) {
  const [open, setOpen] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;
  const Icon = node.icon || (hasChildren ? Folder : File);
  const OpenIcon = variant === "file" && hasChildren ? FolderOpen : Icon;

  return (
    <div>
      <button
        onClick={() => hasChildren && setOpen(!open)}
        className={`w-full flex items-center gap-1.5 py-1.5 px-2 rounded-lg text-[0.8125rem] transition-colors cursor-pointer hover:bg-secondary group ${
          hasChildren ? "" : "pl-6"
        }`}
        style={{ paddingLeft: `${level * 16 + (hasChildren ? 4 : 20)}px` }}
      >
        {hasChildren && (
          <span className="w-4 h-4 flex items-center justify-center shrink-0">
            {open ? (
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </span>
        )}
        {variant === "file" ? (
          open && hasChildren ? (
            <OpenIcon className="w-4 h-4 text-primary shrink-0" />
          ) : (
            <Icon className={`w-4 h-4 shrink-0 ${hasChildren ? "text-warning" : "text-muted-foreground"}`} />
          )
        ) : (
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[0.6rem] shrink-0 ${
              hasChildren ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {node.label[0]}
          </span>
        )}
        <span className="truncate">{node.label}</span>
        {node.badge && (
          <span
            className={`ml-auto text-[0.625rem] px-1.5 py-0.5 rounded-full shrink-0 ${
              node.badge === "modified"
                ? "bg-warning/15 text-warning"
                : node.badge === "new"
                ? "bg-success/15 text-success"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {node.badge}
          </span>
        )}
      </button>
      {open && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeItem key={child.id} node={child} level={level + 1} variant={variant} />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeViewSection() {
  return (
    <SectionWrapper
      id="treeview"
      title="Tree View"
      description="Hierarchical tree components for file systems, org charts, and nested data structures."
    >
      <ComponentCard title="File Explorer">
        <div className="max-w-sm border border-border rounded-xl p-2 bg-card">
          <div className="px-3 py-2 mb-1">
            <p className="text-[0.6875rem] text-muted-foreground uppercase tracking-wider">Explorer</p>
          </div>
          {fileTree.map((node) => (
            <TreeItem key={node.id} node={node} variant="file" />
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Organization Tree">
        <div className="max-w-sm border border-border rounded-xl p-2 bg-card">
          <div className="px-3 py-2 mb-1">
            <p className="text-[0.6875rem] text-muted-foreground uppercase tracking-wider">Team Structure</p>
          </div>
          {orgTree.map((node) => (
            <TreeItem key={node.id} node={node} variant="org" />
          ))}
        </div>
      </ComponentCard>

      <ComponentCard title="Navigation Tree">
        <div className="max-w-sm border border-border rounded-xl p-2 bg-card">
          <div className="px-3 py-2 mb-1">
            <p className="text-[0.6875rem] text-muted-foreground uppercase tracking-wider">Documentation</p>
          </div>
          {[
            {
              id: "gs", label: "Getting Started", icon: Code, children: [
                { id: "install", label: "Installation" },
                { id: "quickstart", label: "Quick Start", badge: "popular" },
                { id: "config", label: "Configuration" },
              ],
            },
            {
              id: "comp", label: "Components", icon: Package, badge: "24", children: [
                { id: "layout2", label: "Layout" },
                { id: "forms2", label: "Forms" },
                { id: "data", label: "Data Display" },
                { id: "feedback", label: "Feedback" },
              ],
            },
            {
              id: "theming", label: "Theming", icon: Settings, children: [
                { id: "tokens", label: "Design Tokens" },
                { id: "colors2", label: "Color System" },
                { id: "dark", label: "Dark Mode" },
              ],
            },
            { id: "api", label: "API Reference", icon: Database },
          ].map((node) => (
            <TreeItem key={node.id} node={node as TreeNode} variant="file" />
          ))}
        </div>
      </ComponentCard>
    </SectionWrapper>
  );
}

import { Search } from "lucide-react";

export function ReviewsSearchBar({
  searchOpen,
  searchText,
  onSearchTextChange,
  onCancel,
}: {
  searchOpen: boolean;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onCancel: () => void;
}) {
  return (
    <div className={`overflow-hidden transition-all duration-300 ${searchOpen ? "max-h-20 opacity-100 mb-4" : "max-h-0 opacity-0 mb-0"}`}>
      <div className="flex items-center gap-3">
        <div className="flex-1 rounded-full border-2 border-foreground px-4 py-2.5 flex items-center gap-2">
          <Search className="w-5 h-5" />
          <input
            value={searchText}
            onChange={(e) => onSearchTextChange(e.target.value)}
            placeholder="Search all reviews"
            className="w-full bg-transparent outline-none text-[1.05rem]"
          />
        </div>
        <button onClick={onCancel} className="text-[0.95rem] cursor-pointer">
          Cancel
        </button>
      </div>
    </div>
  );
}

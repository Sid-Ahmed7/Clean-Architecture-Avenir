"use client";

import { NewsFilters } from "@/types/filtersNews";
import { useState } from "react";
import { Select } from "../ui/Select";
import { NewsCategoryEnum, NewsPriorityEnum } from "@/types/news";

interface FeedFiltersProps {
    initialFilters?: NewsFilters;
    onChange: (filters : NewsFilters) => void;
}

export function FeedFilters({initialFilters, onChange} : FeedFiltersProps) {
    const [category, setCategory] = useState(initialFilters?.category || "");
    const [priority, setPriority] = useState(initialFilters?.priority ||"");
    const [tags, setTags] = useState(initialFilters?.tags?.join(""));


    const handleFiltersChange = () => {
        const filter : NewsFilters = {
            category: category || undefined,
            priority: priority || undefined,
            tags: tags ? tags.split(",").map(t => t.trim()) : undefined,
        };
        onChange(filter);
    }

 return (
    <div className="flex flex-wrap gap-4 items-end mb-4">
      <Select
        label="Catégorie"
        value={category}
        options={[
          { label: "Toutes", value: "" },
          ...Object.values(NewsCategoryEnum).map(c => ({ label: c, value: c })),
        ]}
        onChange={val => { setCategory(val); handleFiltersChange(); }}
      />

      <Select
        label="Priorité"
        value={priority}
        options={[
          { label: "Toutes", value: "" },
          ...Object.values(NewsPriorityEnum).map(p => ({ label: p, value: p })),
        ]}
        onChange={val => { setPriority(val); handleFiltersChange(); }}
      />

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">Tags (virgule séparés)</label>
        <input
          type="text"
          value={tags}
          onChange={e => { setTags(e.target.value); handleFiltersChange(); }}
          placeholder="ex: security,savings"
          className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
}


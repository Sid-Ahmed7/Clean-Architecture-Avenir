"use client";
import { NewsFilters } from "@/types/filtersNews";
import { useEffect, useState } from "react";
import { Select } from "../ui/Select";
import { NewsCategoryEnum, NewsPriorityEnum } from "@/types/news";
import { useTranslations } from "next-intl";

interface FeedFiltersProps {
  initialFilters?: NewsFilters;
  onChange: (filters: NewsFilters) => void;
}

export function FeedFilters({ initialFilters, onChange }: FeedFiltersProps) {
  const t = useTranslations("components.feed.filters");
  const [category, setCategory] = useState(initialFilters?.category || "");
  const [priority, setPriority] = useState(initialFilters?.priority || "");
  const [tags, setTags] = useState(initialFilters?.tags?.join(",") || "");


  const handleFiltersChange = () => {
    onChange({
      category: category || undefined,
      priority: priority || undefined,
      tags: tags ? tags.split(",").map(t => t.trim()) : undefined,
    });
  }

  useEffect(() => {
    handleFiltersChange();
  }, [category, priority, tags]);


  return (
    <div className="flex flex-wrap gap-4 items-end mb-4">
      <Select
        label={t("category")}
        value={category}
        options={[
          { label: t("all"), value: "" },
          ...Object.values(NewsCategoryEnum).map(c => ({ label: c, value: c })),
        ]}
        onChange={val => { setCategory(val); handleFiltersChange(); }}
        className="text-gray-900"
      />

      <Select
        label={t("priority")}
        value={priority}
        options={[
          { label: t("all"), value: "" },
          ...Object.values(NewsPriorityEnum).map(p => ({ label: p, value: p })),
        ]}
        onChange={val => { setPriority(val); handleFiltersChange(); }}
        className="text-gray-900"
      />

      <div className="flex flex-col">
        <label className="text-sm font-medium mb-1 text-gray-900">{t("tagsLabel")}</label>
        <input
          type="text"
          value={tags}
          onChange={e => { setTags(e.target.value); handleFiltersChange(); }}
          placeholder={t("tagsPlaceholder")}
          className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900"
        />
      </div>
    </div>
  );
}


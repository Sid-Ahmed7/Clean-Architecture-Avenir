
import { News } from "@/types/news";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { LocaleContext } from "@/contexts/LocaleProvider";
import { useTranslations } from "next-intl";


interface FeedManageListProps {
    news: News[]
    onDelete: (id: string) => Promise<void>
}

export function FeedManageList({news, onDelete} : FeedManageListProps) {
  const t = useTranslations('components.feed.manageList');
  const router = useRouter();
  const {locale} = useContext(LocaleContext);

  const handleEdit = (id: string) => {
    router.push(`/${locale}/feed/edit/${id}`);
  }


  return (
    <section className="space-y-4">
      {news.length === 0 ? (
        <p className="text-center text-gray-500">{t('noArticles')}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <Card key={n.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{n.title}</h3>
                <div className="text-xs text-gray-400">
                  <span>{t('category')}: {n.category}</span> •{" "}
                  <span>{t('priority')}: {n.priority}</span> •{" "}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => handleEdit(n.id)}
                >
                  <Pencil size={14} />
                  {t('edit')}
                </Button>

                <Button
                  variant="danger"
                  onClick={() => onDelete(n.id)}
                >
                  <Trash2 size={14} />
                  {t('delete')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
  }

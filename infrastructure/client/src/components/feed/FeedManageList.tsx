import { News } from "@/types/news";
import { Card } from "../ui/Card";
import Button from "../ui/Button";
import { Pencil, Trash2 } from "lucide-react";

interface FeedManageListProps {
    news: News[]
    onUpdate: (news: News) => Promise<News | void>
    onDelete: (id: number) => Promise<void>
}

export function FeedManageList({news, onUpdate, onDelete} : FeedManageListProps) {
  return (
    <section className="space-y-4">
      {news.length === 0 ? (
        <p className="text-center text-gray-500">Aucun article à afficher.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((n) => (
            <Card key={n.id} className="flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">{n.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2">{n.content}</p>
                <div className="text-xs text-gray-400">
                  <span>Catégorie : {n.category}</span> •{" "}
                  <span>Priorité : {n.priority}</span> •{" "}
                  <span>Vues : {n.views}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => onUpdate(n)}
                >
                  <Pencil size={14} />
                  Modifier
                </Button>

                <Button
                  variant="danger"
                  onClick={() => onDelete(n.id)}
                >
                  <Trash2 size={14} />
                  Supprimer
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
  }

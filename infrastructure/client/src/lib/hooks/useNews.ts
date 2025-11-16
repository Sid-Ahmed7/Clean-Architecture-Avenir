import { News } from "@/types/news";
import { useCallback, useState } from "react";
import * as newsApi from "@/lib/api/news/client/news"
import { NewsFilters } from "@/types/filtersNews";
import z from "zod";
import { newsSchema } from "../validation/news/newsSchema";
import { useTranslations } from "next-intl";
import { CreateNews } from "@/types/createNews";

export const useNews = (initialNews : News[] = []) => {
    const [newsList, setNewsList] = useState<News[]>(initialNews);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const t = useTranslations();

     const fetchNews = useCallback((filters: NewsFilters = {}, pageNum: number = 1, limit: number = 10) => {
        setLoading(true);
        setError(null);

        newsApi.getAllNews({ ...filters, page: pageNum, limit }).then((fetched) => {
        const parsed = z.array(newsSchema(t)).safeParse(fetched);

        if (parsed.success) {
          if (pageNum === 1){
            setNewsList(parsed.data);
          } else {
            setNewsList((prev) => [...prev, ...parsed.data]);
          }

          setHasMore(parsed.data.length === limit);
          setPage(pageNum);
        } else {
          console.warn("Certaines news sont invalides :", parsed.error);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur inconnue");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getNews = (id: number) => {
  setLoading(true);
  setError(null);

  return newsApi.getNewsById(id)
    .then((item) => {
      if (item) {
        return item;
      } else {
        setError("Feed introuvable");
        return null;
      }
    })
    .catch((err) => {
      setError(err.response?.data?.error || err.message || "Erreur inconnue");
      return null;
    })
    .finally(() => setLoading(false));
};


  const createNews = (news: CreateNews) => {
   setLoading(true);
    setError(null);

    return newsApi.createNews(news).then((created) => {
        const parsed = newsSchema(t).safeParse(created);
        if (parsed.success) {
          setNewsList((prev) => [parsed.data, ...prev]);
          return parsed.data;
        } else {
            setError(parsed?.error.message  || "Erreur lors de la création");
        }
      }).catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur");
      }).finally(() => setLoading(false));
  };

  const updateNews = (news: News) => {
    setLoading(true);
    setError(null);

    return newsApi.updateNews(news).then((updated) => {
        const parsed = newsSchema((t)).safeParse(updated);
        if (parsed.success) {
          setNewsList((prev) =>
            prev.map((n) => (n.id === parsed.data.id ? parsed.data : n))
          );
          return parsed.data;
        } else {
          setError(parsed?.error.message  || "Erreur lors de la mise à jour");

        }
      }).catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur");
      }).finally(() => setLoading(false));
  };

  const deleteNews = (id: number) => {
    setLoading(true);
    setError(null);

    return newsApi.deleteNews(id).then(() => {
        setNewsList((prev) => prev.filter((n) => n.id !== id));
      }).catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur");
      })
      .finally(() => setLoading(false));
  };

  const incrementViews = (id: number) => {
    return newsApi.incrementNewsViews(id).then((updated) => {
        const parsed = newsSchema((t)).safeParse(updated);
        if (parsed.success) {
          setNewsList((prev) =>
            prev.map((n) => (n.id === parsed.data.id ? parsed.data : n))
          );
          return parsed.data;
        } else {
          setError(parsed?.error.message  || "Erreur lors du changement de nombre de vue");

        }
      }).catch((err) => {
        setError(err.response?.data?.error || err.message || "Erreur inconnue");
      });
  };

  return {newsList, fetchNews, createNews, getNews,updateNews, deleteNews, incrementViews, page, hasMore, loading, error, setPage};
};
import { useState, useEffect, useCallback } from "react";
import { feedbackService } from "../services/feedback.service";
import { FeedbackResponseDto } from "../types/dtos/feedback.dto";

export const useFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterSeen, setFilterSeen] = useState<boolean | null>(null);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await feedbackService.getFeedbacks();
      setFeedbacks(response.data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar feedbacks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const markAsSeen = async (id: string) => {
    try {
      await feedbackService.markAsSeen(id);
      setFeedbacks((prev) =>
        prev
          .map((f) => (f.id === id ? { ...f, seen: true } : f))
          .sort((a, b) => {
            if (a.seen === b.seen) {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
            return a.seen ? 1 : -1;
          }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAsUnseen = async (id: string) => {
    try {
      await feedbackService.markAsUnseen(id);
      setFeedbacks((prev) =>
        prev
          .map((f) => (f.id === id ? { ...f, seen: false } : f))
          .sort((a, b) => {
            if (a.seen === b.seen) {
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            }
            return a.seen ? 1 : -1;
          }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (filterSeen === null) return true;
    return f.seen === filterSeen;
  });

  return {
    feedbacks: filteredFeedbacks,
    loading,
    error,
    filterSeen,
    setFilterSeen,
    markAsSeen,
    markAsUnseen,
    refresh: fetchFeedbacks,
  };
};

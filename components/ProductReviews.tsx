"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addReview,
  formatReviewDate,
  getAverageRating,
  getReviewsByProductId,
  type ProductReview,
} from "@/lib/local-reviews";

function Stars({
  rating,
  size = 18,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {Array.from({ length: 5 }).map((_, index) => {
        const active = index < Math.round(rating);
        return (
          <span
            key={index}
            style={{
              fontSize: `${size}px`,
              lineHeight: 1,
              color: active ? "#f59e0b" : "#cbd5e1",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

export default function ProductReviews({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  useEffect(() => {
    const sync = () => setReviews(getReviewsByProductId(productId));
    sync();
    window.addEventListener("reviews-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("reviews-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, [productId]);

  const average = useMemo(() => getAverageRating(productId), [productId, reviews]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!author.trim()) {
      alert("Будь ласка, введи ім'я.");
      return;
    }

    if (!text.trim()) {
      alert("Будь ласка, напиши відгук.");
      return;
    }

    addReview({
      productId,
      author,
      rating,
      text,
    });

    setAuthor("");
    setRating(5);
    setText("");
  }

  return (
    <section style={{ marginTop: "30px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 420px",
          gap: "18px",
          alignItems: "start",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #dbe1ea",
            borderRadius: "28px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "14px",
              alignItems: "center",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 900,
                  color: "#0f172a",
                }}
              >
                Відгуки
              </h2>
              <div style={{ marginTop: "8px", color: "#64748b" }}>
                Для товару: {productName}
              </div>
            </div>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "14px 16px",
                minWidth: "180px",
              }}
            >
              <div style={{ fontSize: "14px", color: "#64748b", marginBottom: "6px" }}>
                Середня оцінка
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div style={{ fontSize: "28px", fontWeight: 900 }}>
                  {reviews.length ? average.toFixed(1) : "—"}
                </div>
                <Stars rating={average || 0} />
              </div>
              <div style={{ marginTop: "6px", color: "#64748b", fontSize: "14px" }}>
                Відгуків: {reviews.length}
              </div>
            </div>
          </div>

          {reviews.length === 0 ? (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "18px",
                padding: "18px",
                color: "#64748b",
                lineHeight: 1.7,
              }}
            >
              Поки що відгуків немає. Будь першим, хто поділиться враженням про цей товар.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {reviews.map((review) => (
                <div
                  key={review.id}
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e5e7eb",
                    borderRadius: "18px",
                    padding: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: "17px",
                          color: "#0f172a",
                        }}
                      >
                        {review.author}
                      </div>
                      <div style={{ marginTop: "6px" }}>
                        <Stars rating={review.rating} />
                      </div>
                    </div>

                    <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                      {formatReviewDate(review.createdAt)}
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "14px",
                      color: "#475569",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {review.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside
          style={{
            background: "#ffffff",
            border: "1px solid #dbe1ea",
            borderRadius: "28px",
            padding: "24px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 900,
              marginBottom: "10px",
              color: "#0f172a",
            }}
          >
            Залишити відгук
          </div>

          <div
            style={{
              color: "#64748b",
              lineHeight: 1.7,
              marginBottom: "18px",
            }}
          >
            Напиши коротко, що сподобалось або що варто знати перед покупкою.
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
            <label style={{ display: "grid", gap: "8px" }}>
              <span style={{ fontWeight: 700 }}>Ім&apos;я</span>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Наприклад: Артем"
                style={{
                  height: "48px",
                  borderRadius: "14px",
                  border: "1px solid #dbe1ea",
                  padding: "0 14px",
                  fontSize: "15px",
                  background: "#ffffff",
                }}
              />
            </label>

            <label style={{ display: "grid", gap: "8px" }}>
              <span style={{ fontWeight: 700 }}>Оцінка</span>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={{
                  height: "48px",
                  borderRadius: "14px",
                  border: "1px solid #dbe1ea",
                  padding: "0 14px",
                  fontSize: "15px",
                  background: "#ffffff",
                }}
              >
                <option value={5}>5 — Відмінно</option>
                <option value={4}>4 — Добре</option>
                <option value={3}>3 — Нормально</option>
                <option value={2}>2 — Слабо</option>
                <option value={1}>1 — Погано</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: "8px" }}>
              <span style={{ fontWeight: 700 }}>Відгук</span>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Що тобі сподобалось у товарі?"
                rows={6}
                style={{
                  borderRadius: "14px",
                  border: "1px solid #dbe1ea",
                  padding: "14px",
                  fontSize: "15px",
                  background: "#ffffff",
                  resize: "vertical",
                }}
              />
            </label>

            <button
              type="submit"
              style={{
                height: "52px",
                borderRadius: "16px",
                border: "none",
                background: "#2f63f6",
                color: "#ffffff",
                fontWeight: 900,
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Опублікувати відгук
            </button>
          </form>
        </aside>
      </div>
    </section>
  );
}

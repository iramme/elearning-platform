import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2, Send } from 'lucide-react';
import { reviewService } from '../../services/reviewService';

export default function ReviewForm({ courseId, existingReview, onReviewSubmitted }) {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (rating === 0) {
      setError('Choisis une note avant de soumettre.');
      return;
    }

    setLoading(true);
    try {
      if (existingReview) {
        await reviewService.updateReview(existingReview.id, { rating, comment });
      } else {
        await reviewService.createReview({ course: courseId, rating, comment });
      }
      setSuccess(true);
      onReviewSubmitted();
    } catch (err) {
      const messages = err.response?.data;
      const firstError = messages ? Object.values(messages)[0] : null;
      setError(Array.isArray(firstError) ? firstError[0] : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="card"
    >
      <h3 className="font-semibold text-dark mb-3">
        {existingReview ? 'Modifie ton avis' : 'Laisse ton avis sur ce cours'}
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded-xl mb-3">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-success-50 text-success-600 text-sm px-3 py-2 rounded-xl mb-3">
          Merci pour ton avis ! 🎉
        </div>
      )}

      <div className="flex items-center gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= (hoverRating || rating)
                  ? 'fill-secondary-400 text-secondary-400'
                  : 'text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        placeholder="Qu'as-tu pensé de ce cours ? (optionnel)"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition resize-none text-sm mb-4"
      />

      <button
        type="submit"
        disabled={loading}
        className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {existingReview ? 'Mettre à jour' : "Envoyer l'avis"}
      </button>
    </motion.form>
  );
}
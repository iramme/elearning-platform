import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PlayCircle, CheckCircle2 } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import { progressService } from '../../services/progressService';
import { extractResults } from '../../utils/extractResults';

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, progressRes] = await Promise.all([
          paymentService.getMyOrders(),
          progressService.getMyProgress(),
        ]);

        const paidOrders = extractResults(ordersRes.data).filter((o) => o.status === 'PAID');
        const progressList = extractResults(progressRes.data);

        const merged = paidOrders.map((order) => {
          const progress = progressList.find((p) => p.course === order.course);
          return {
            courseId: order.course,
            slug: order.course_slug,
            title: order.course_title,
            percent: progress?.percent_complete || 0,
            isCompleted: progress?.is_completed || false,
          };
        });

        setCourses(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-dark mb-1">Mes cours 📚</h1>
      <p className="text-gray-500 mb-8">Reprends ton apprentissage là où tu t'es arrêté</p>

      {courses.length === 0 ? (
        <div className="card text-center py-16">
          <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Tu n'as encore acheté aucun cours.</p>
          <Link to="/courses" className="btn-primary inline-block">Explorer le catalogue</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((c) => (
            <motion.div key={c.courseId} whileHover={{ y: -4 }} className="card">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-dark">{c.title}</h3>
                {c.isCompleted && (
                  <span className="badge-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terminé
                  </span>
                )}
              </div>
              <div className="progress-bar mb-2">
                <div className="progress-bar-fill" style={{ width: `${c.percent}%` }} />
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-500">{c.percent}% complété</span>
                <Link
                  to={`/learn/${c.slug}`}
                  className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  {c.percent > 0 ? 'Continuer' : 'Commencer'}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
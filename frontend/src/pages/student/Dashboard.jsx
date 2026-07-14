import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Award, TrendingUp, PlayCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { paymentService } from '../../services/paymentService';
import { progressService } from '../../services/progressService';
import { certificateService } from '../../services/certificateService';
import { useAuth } from '../../hooks/useAuth';
import StatCard from '../../components/ui/StatCard';
import ProgressBar from '../../components/ui/ProgressBar';
import { extractResults } from '../../utils/extractResults';
import PageHero from '../../components/layout/PageHero';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [progress, setProgress] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersRes, progressRes, certificatesRes] = await Promise.all([
          paymentService.getMyOrders(),
          progressService.getMyProgress(),
          certificateService.getMyCertificates(),
        ]);
        setOrders(extractResults(ordersRes.data));
        setProgress(extractResults(progressRes.data));
        setCertificates(extractResults(certificatesRes.data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const paidOrders = orders.filter((o) => o.status === 'PAID');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title={`Salut ${user.username}`}
        subtitle="Voici où tu en es dans ton apprentissage"
        icon="👋"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon={BookOpen} label="Cours achetés" value={paidOrders.length} color="primary" />
          <StatCard icon={TrendingUp} label="Cours en cours" value={progress.filter(p => !p.is_completed).length} color="secondary" />
          <StatCard icon={Award} label="Certificats obtenus" value={certificates.length} color="success" />
        </div>

        {/* Progression des cours */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-dark mb-4">Ma progression</h2>
          {progress.length === 0 ? (
            <div className="card text-center py-10">
              <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Tu n'as pas encore commencé de cours.</p>
              <Link to="/courses" className="btn-primary inline-block mt-4">Explorer le catalogue</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {progress.map((p) => (
                <motion.div key={p.id} whileHover={{ y: -2 }} className="card">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-dark">{p.course_title}</h3>
                    {p.is_completed && (
                      <span className="badge-success">Terminé 🎉</span>
                    )}
                  </div>
                  <ProgressBar percent={p.percent_complete} />
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm text-gray-500">{p.percent_complete}% complété</span>
                    <Link
                      to={`/learn/${p.course_slug}`}
                      className="text-primary-600 text-sm font-semibold flex items-center gap-1 hover:underline"
                    >
                      <PlayCircle className="w-4 h-4" /> Continuer
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Certificats récents */}
        {certificates.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-dark mb-4">Mes certificats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <a
                  key={cert.id}
                  href={cert.pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  className="card flex items-center gap-3 hover:shadow-glow-primary"
                >
                  <div className="bg-success-50 p-3 rounded-xl">
                    <Award className="w-6 h-6 text-success-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-dark">{cert.course_title}</p>
                    <p className="text-xs text-gray-500">Voir le certificat →</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
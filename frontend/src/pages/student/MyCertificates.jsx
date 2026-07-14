import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Download, ExternalLink } from 'lucide-react';
import { certificateService } from '../../services/certificateService';
import { extractResults } from '../../utils/extractResults';

export default function MyCertificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const { data } = await certificateService.getMyCertificates();
        setCertificates(extractResults(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCertificates();
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
      <h1 className="text-3xl font-bold text-dark mb-1">Mes certificats 🏆</h1>
      <p className="text-gray-500 mb-8">Tous les cours que tu as complétés avec succès</p>

      {certificates.length === 0 ? (
        <div className="card text-center py-16">
          <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Tu n'as pas encore obtenu de certificat.</p>
          <p className="text-gray-400 text-sm mt-1">Termine un cours à 100% pour en débloquer un !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {certificates.map((cert) => (
            <motion.a
              key={cert.id}
              href={cert.pdf_url}
              target="_blank"
              rel="noreferrer"
              whileHover={{ y: -4 }}
              className="card flex items-center gap-4"
            >
              <div className="bg-success-50 p-4 rounded-xl flex-shrink-0">
                <Award className="w-7 h-7 text-success-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-dark truncate">{cert.course_title}</h3>
                <p className="text-xs text-gray-400 mb-1">
                  Délivré le {new Date(cert.issued_at).toLocaleDateString('fr-FR')}
                </p>
                <span className="text-primary-600 text-sm font-semibold flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5" /> Ouvrir le certificat
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}
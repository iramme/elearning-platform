import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Rocket, BookOpen, Award, Users, Star,
  Code, Palette, Megaphone, ArrowRight, PlayCircle, LayoutDashboard, Plus
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const features = [
  {
    icon: PlayCircle,
    title: 'Cours vidéo à ton rythme',
    description: 'Apprends quand tu veux, où tu veux, avec des vidéos de qualité et une progression sauvegardée.',
    color: 'bg-primary-100 text-primary-600',
  },
  {
    icon: Award,
    title: 'Certificats reconnus',
    description: 'Obtiens un certificat vérifiable dès que tu termines un cours à 100%.',
    color: 'bg-success-100 text-success-600',
  },
  {
    icon: Users,
    title: 'Instructeurs experts',
    description: 'Des cours créés par des professionnels passionnés dans leur domaine.',
    color: 'bg-secondary-100 text-secondary-600',
  },
];

const categories = [
  { icon: Code, label: 'Développement', color: 'from-primary-500 to-primary-700' },
  { icon: Palette, label: 'Design', color: 'from-pink-500 to-secondary-500' },
  { icon: Megaphone, label: 'Marketing', color: 'from-secondary-400 to-secondary-600' },
];

export default function Home() {
  const { isAuthenticated, user, isInstructor } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-hero relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-10 -left-10 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-20 -right-16 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6"
          >
            <Rocket className="w-4 h-4" />
            {isInstructor ? 'Espace Instructeur' : 'Plus de 50 cours disponibles'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight"
          >
            {isInstructor ? (
              <>Partage ton savoir,<br />inspire des étudiants</>
            ) : (
              <>Apprends de nouvelles<br />compétences, à ton rythme</>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 text-lg mb-9 max-w-xl mx-auto"
          >
            {isInstructor
              ? 'Crée des cours vidéo, suis tes ventes et fais grandir ta communauté d\'étudiants.'
              : 'Des cours vidéo créés par des experts, un suivi de progression, et un certificat à la clé.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            {isInstructor ? (
              <>
                <Link to="/instructor/dashboard" className="btn-secondary flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Mon dashboard
                </Link>
                <Link to="/instructor/courses/new" className="bg-white/15 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Créer un cours
                </Link>
              </>
            ) : isAuthenticated ? (
              <Link to="/courses" className="btn-secondary flex items-center gap-2">
                Explorer les cours <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-secondary flex items-center gap-2">
                  Commencer gratuitement <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/courses" className="bg-white/15 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/25 transition">
                  Voir le catalogue
                </Link>
              </>
            )}
          </motion.div>

          {isAuthenticated && (
            <p className="text-white/70 text-sm mt-6">
              Connecté en tant que <strong className="text-white">{user.username}</strong>
              {isInstructor && ' (Instructeur)'}
            </p>
          )}
        </div>
      </div>

      {/* Catégories populaires — masqué pour l'instructeur, pas pertinent pour lui */}
      {!isInstructor && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-dark mb-2">Explore par catégorie</h2>
            <p className="text-gray-500">Trouve le domaine qui te correspond</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <motion.div key={cat.label} whileHover={{ y: -4 }}>
                  <Link
                    to="/courses"
                    className={`bg-gradient-to-br ${cat.color} rounded-2xl p-8 flex flex-col items-center gap-3 text-white relative overflow-hidden group`}
                  >
                    <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/10" />
                    <Icon className="w-10 h-10 relative z-10 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold relative z-10">{cat.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pourquoi EduSpark — contenu adapté au rôle */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-dark mb-2">
              {isInstructor ? 'Pourquoi enseigner sur EduSpark ?' : 'Pourquoi choisir EduSpark ?'}
            </h2>
            <p className="text-gray-500">
              {isInstructor ? 'Tout ce qu\'il te faut pour créer et vendre tes cours' : 'Une plateforme pensée pour ta réussite'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(isInstructor
              ? [
                  { icon: PlayCircle, title: 'Upload facile', description: 'Ajoute tes vidéos et ressources en quelques clics, hébergées de façon sécurisée.', color: 'bg-primary-100 text-primary-600' },
                  { icon: Award, title: 'Paiements sécurisés', description: 'Reçois tes paiements via Stripe, en toute transparence.', color: 'bg-success-100 text-success-600' },
                  { icon: Users, title: 'Suivi de tes étudiants', description: 'Consulte tes statistiques : ventes, notes, avis en temps réel.', color: 'bg-secondary-100 text-secondary-600' },
                ]
              : features
            ).map((f) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title} whileHover={{ y: -4 }} className="card">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-dark mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA final — uniquement visiteurs non connectés */}
      {!isAuthenticated && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-14 -left-10 w-64 h-64 rounded-full bg-white/10" />

            <GraduationCap className="w-12 h-12 text-white mx-auto mb-4 relative z-10" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 relative z-10">
              Prêt à commencer ton apprentissage ?
            </h2>
            <p className="text-white/85 mb-7 max-w-lg mx-auto relative z-10">
              Crée ton compte gratuitement et accède à des dizaines de cours dès aujourd'hui.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-7 py-3.5 rounded-xl hover:scale-[1.02] transition-transform relative z-10"
            >
              Créer mon compte <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
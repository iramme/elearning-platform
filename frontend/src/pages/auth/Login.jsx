import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, GraduationCap, Loader2, Sparkles, BookOpen, Award, Users } from 'lucide-react';
import { authService } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authService.login(formData.username, formData.password);
      login(data.access, data.refresh);
      navigate('/dashboard');
    } catch {
      setError("Identifiants incorrects. Vérifie ton nom d'utilisateur et mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Panneau gauche — illustration / branding */}
      <div className="hidden lg:flex bg-gradient-hero relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-white blur-3xl" />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2.5">
          <div className="bg-white/15 backdrop-blur-sm p-2 rounded-xl">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl text-white">EduSpark</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Continue ton apprentissage, <br /> une leçon à la fois ✨
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-md">
            Rejoins des milliers d'étudiants qui progressent chaque jour avec EduSpark.
          </p>

          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-white/90">
              <div className="bg-white/15 p-2 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Cours illimités</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="bg-white/15 p-2 rounded-lg">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Certificats</span>
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <div className="bg-white/15 p-2 rounded-lg">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">Communauté</span>
            </div>
          </div>
        </motion.div>

        <p className="relative z-10 text-white/60 text-sm">© 2026 EduSpark. Tous droits réservés.</p>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-[#FAFAF9]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo mobile only */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-10 justify-center">
            <div className="bg-primary-600 p-2 rounded-xl">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-dark">EduSpark</span>
          </Link>

          <div className="flex items-center gap-2 text-primary-600 font-semibold text-sm mb-3">
            <Sparkles className="w-4 h-4" /> Content de te revoir
          </div>
          <h1 className="text-2xl font-bold text-dark mb-2">Connecte-toi à ton compte</h1>
          <p className="text-gray-500 text-sm mb-8">Entre tes identifiants pour continuer ton apprentissage</p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition"
                  placeholder="ton_pseudo"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2 py-3.5"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Se connecter'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OU</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Inscris-toi gratuitement
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, GraduationCap, BookOpen, Loader2 } from 'lucide-react';
import { authService } from '../../services/authService';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password2: '', role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authService.register(formData);
      navigate('/login');
    } catch (err) {
      const messages = err.response?.data;
      const firstError = messages ? Object.values(messages)[0] : null;
      setError(Array.isArray(firstError) ? firstError[0] : 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="bg-secondary-100 p-4 rounded-2xl mb-4">
            <GraduationCap className="w-8 h-8 text-secondary-500" />
          </div>
          <h1 className="text-2xl font-bold text-dark">Rejoins l'aventure 🚀</h1>
          <p className="text-gray-500 text-sm mt-1">Crée ton compte en 30 secondes</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Choix du rôle */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'STUDENT' })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                formData.role === 'STUDENT'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <BookOpen className={`w-6 h-6 ${formData.role === 'STUDENT' ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="text-sm font-semibold">Étudiant</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, role: 'INSTRUCTOR' })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
                formData.role === 'INSTRUCTOR'
                  ? 'border-secondary-500 bg-secondary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <GraduationCap className={`w-6 h-6 ${formData.role === 'INSTRUCTOR' ? 'text-secondary-500' : 'text-gray-400'}`} />
              <span className="text-sm font-semibold">Instructeur</span>
            </button>
          </div>

          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text" name="username" required value={formData.username} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="email@exemple.com"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password" name="password" required value={formData.password} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="Mot de passe"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password" name="password2" required value={formData.password2} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
              placeholder="Confirme le mot de passe"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-secondary w-full flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Connecte-toi
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
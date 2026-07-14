import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    secondary: 'bg-secondary-50 text-secondary-500',
    success: 'bg-success-50 text-success-600',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card flex items-center gap-4"
    >
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-bold text-dark">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}
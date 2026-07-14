import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, PartyPopper } from 'lucide-react';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card max-w-md text-center"
      >
        <div className="bg-success-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-success-600" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Paiement réussi ! <PartyPopper className="inline w-6 h-6 text-secondary-500" /></h1>
        <p className="text-gray-500 mb-6">
          Ton accès au cours est maintenant débloqué. Direction ton dashboard pour commencer !
        </p>
        <Link to="/dashboard" className="btn-primary w-full inline-block">
          Aller à mon dashboard
        </Link>
      </motion.div>
    </div>
  );
}
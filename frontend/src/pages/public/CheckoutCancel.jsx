import { Link } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export default function CheckoutCancel() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card max-w-md text-center">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
          <XCircle className="w-9 h-9 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-dark mb-2">Paiement annulé</h1>
        <p className="text-gray-500 mb-6">
          Aucun montant n'a été débité. Tu peux reprendre l'achat à tout moment.
        </p>
        <Link to="/courses" className="btn-primary w-full inline-block">
          Retour au catalogue
        </Link>
      </div>
    </div>
  );
}
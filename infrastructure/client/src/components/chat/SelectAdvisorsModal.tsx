"use client";

import { getAllAdvisors } from "@/lib/api/auth";
import { getNameAdvisor } from "@/lib/utils/chatUtils";
import { Advisor } from "@/types/Advisor";
import { ArrowRight, Building2, CheckCircle2, Search, User, X } from "lucide-react";
import { useEffect, useState } from "react";


interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTransfer: (advisorId: string) => void;
    currentAdvisorId: string;
}


export default function SelectAdvisorsModal({isOpen, onClose, onTransfer, currentAdvisorId}: TransferModalProps) {

    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string| null>(null);
    const [search, setSearch] = useState("");
    const[selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);

    const fetchAdvisors = async () => {
        setLoading(true);
        try {
            const data = await getAllAdvisors();

            const filterAdvisor = data.filter((advisor: Advisor) => advisor.id !== currentAdvisorId);
            setAdvisors(filterAdvisor);
        } catch (err) {
            setError("Impossible de récuperer les conseillers")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        fetchAdvisors();
    }, [isOpen, currentAdvisorId]);

    if(!isOpen) {
        return null;
    }

    const filteredAdvisors = advisors.filter((advisor) =>
      getNameAdvisor(advisor).toLowerCase().includes(search.toLowerCase())
  );

    const getInitials = (advisor: Advisor) => {
      const name = getNameAdvisor(advisor);
      if (!name) return advisor.email.slice(0, 2).toUpperCase(); 
      return name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-200">
        
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Transfert de Dossier Client
                </h2>
                <p className="text-slate-300 text-sm mt-0.5">
                  Sélectionnez un nouveau conseiller
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="px-8 pt-6 pb-4 bg-slate-50 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou identifiant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent outline-none transition-all text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="px-8 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-10 h-10 border-4 border-slate-200 border-t-slate-600 rounded-full mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Chargement des conseillers...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 font-medium mb-3">{error}</p>
              <button
                onClick={fetchAdvisors}
                className="px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
              >
                Réessayer
              </button>
            </div>
          ) : filteredAdvisors.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">Aucun conseiller trouvé</p>
              <p className="text-slate-400 text-sm mt-1">Essayez avec d'autres critères</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {filteredAdvisors.map((advisor) => (
                
                <div
                  key={advisor.id}
                  onClick={() => setSelectedAdvisor(advisor.id)}
                  className={`group relative p-5 rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedAdvisor === advisor.id
                      ? "bg-slate-800 shadow-lg scale-[1.02]"
                      : "bg-white border-2 border-slate-200 hover:border-slate-400 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                        selectedAdvisor === advisor.id
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                      }`}>
                        <div>{getInitials(advisor)}</div>
                      </div>
                      
                      <div>
                        <h3 className={`font-semibold transition-colors ${
                          selectedAdvisor === advisor.id
                            ? "text-white"
                            : "text-slate-800 group-hover:text-slate-900"
                        }`}>
                          {getNameAdvisor(advisor)}
                        </h3>
                      </div>
                    </div>

                    <div className={`transition-all duration-200 ${
                      selectedAdvisor === advisor.id
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-75"
                    }`}>
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-8 py-6 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white border-2 border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all"
          >
            Annuler
          </button>
          <button
          onClick={() => selectedAdvisor && onTransfer(selectedAdvisor)}
            disabled={!selectedAdvisor}
            className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-900 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 disabled:shadow-none"
          >
            <span>Valider le transfert</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
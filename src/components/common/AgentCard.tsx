import React from 'react';
import { Phone, Mail, MessageSquare, Star, Award, ChevronRight } from 'lucide-react';
import { IAgent } from '../../types';

interface AgentCardProps {
  agent: IAgent;
  onContactAgent?: (agent: IAgent) => void;
  onViewProfile?: (agent: IAgent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  onContactAgent,
  onViewProfile
}) => {
  return (
    <div
      id={`agent-card-${agent.id}`}
      className="group bg-white border border-black/10 hover:border-[#B5945E]/60 p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Top Agent Headshot & Rating */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <img
              src={agent.image}
              alt={agent.name}
              referrerPolicy="no-referrer"
              className="w-20 h-20 object-cover border border-black/10 group-hover:border-[#B5945E] transition-colors"
            />
            <div className="absolute -bottom-2 -right-2 px-1.5 py-0.5 bg-[#1A1A1A] text-[9px] font-bold text-white flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 text-[#B5945E] fill-[#B5945E]" />
              <span>{agent.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#1A1A1A] group-hover:text-[#B5945E] transition-colors truncate">
              {agent.name}
            </h4>
            <p className="text-xs text-[#B5945E] font-medium mb-1 line-clamp-1">
              {agent.position}
            </p>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-black/50">
              <span className="flex items-center gap-1 font-medium">
                <Award className="w-3 h-3 text-[#B5945E]" />
                {agent.experienceYears}+ Yrs Exp
              </span>
              <span>•</span>
              <span>{agent.propertiesCount} Portfolios</span>
            </div>
          </div>
        </div>

        {/* Specialization Badge */}
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 bg-[#F7F5F2] border border-black/5 text-[10px] uppercase tracking-wider text-[#1A1A1A] font-semibold">
            {agent.specialization}
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs leading-relaxed text-black/60 line-clamp-3 mb-5">
          {agent.bio}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-black/5">
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`tel:${agent.phone}`}
            className="py-2 px-2.5 bg-[#F7F5F2] hover:bg-[#EAE7E2] text-[#1A1A1A] text-[10px] uppercase tracking-widest font-medium flex items-center justify-center gap-1.5 transition-colors border border-black/5"
          >
            <Phone className="w-3 h-3 text-[#B5945E]" />
            <span className="truncate">Call</span>
          </a>

          {agent.whatsapp && (
            <a
              href={`https://wa.me/${agent.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 bg-[#F7F5F2] hover:bg-[#EAE7E2] text-[#1A1A1A] text-[10px] uppercase tracking-widest font-medium flex items-center justify-center gap-1.5 transition-colors border border-black/5"
            >
              <MessageSquare className="w-3 h-3 text-[#B5945E]" />
              <span>WhatsApp</span>
            </a>
          )}
        </div>

        {onContactAgent && (
          <button
            onClick={() => onContactAgent(agent)}
            className="w-full py-2 px-3 bg-[#1A1A1A] hover:bg-[#B5945E] text-white text-[10px] uppercase tracking-widest font-medium transition-all flex items-center justify-center gap-1"
          >
            <span>Consult Advisor</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

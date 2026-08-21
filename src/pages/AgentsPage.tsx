import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Award, ShieldCheck, Phone, Mail, MessageSquare, ArrowRight } from 'lucide-react';
import { IAgent } from '../types';
import { agentService } from '../services/api';
import { AgentCard } from '../components/common/AgentCard';

interface AgentsPageProps {
  navigate: (route: string, params?: Record<string, any>) => void;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ navigate }) => {
  const [agents, setAgents] = useState<IAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      setIsLoading(true);
      try {
        const res = await agentService.getAgents();
        if (res.success) {
          setAgents(res.agents);
        }
      } catch (err) {
        console.error('Failed to load agents:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAgents();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-black/10 p-8 sm:p-12 text-center max-w-4xl mx-auto shadow-sm">
        <div className="relative z-10 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDFCF9] border border-black/10 text-[#B5945E] text-[10px] font-bold uppercase tracking-widest">
            <Award className="w-3 h-3 text-[#B5945E]" />
            Elite Advisory Council
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight">
            Our Senior Property Advisors & Consultants
          </h1>
          <p className="text-xs sm:text-sm text-black/60 max-w-2xl mx-auto leading-relaxed">
            With decades of combined transaction volume and unmatched connections across regulatory bodies, our advisors navigate prime real estate acquisitions with discretion and mastery.
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-80 bg-black/5 animate-pulse border border-black/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {agents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onContactAgent={() => navigate('contact', { subject: `Inquiry with Advisor: ${agent.name}` })}
            />
          ))}
        </div>
      )}

      {/* Join the Advisory Banner */}
      <div className="bg-[#F7F5F2] border border-black/10 p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-3">
        <h3 className="font-serif text-2xl font-bold text-[#1A1A1A]">
          Are You an Accomplished Luxury Broker?
        </h3>
        <p className="text-xs text-black/60 max-w-lg mx-auto">
          Growth Realtors invites verified top producers and legal real estate specialists to join Pakistan's most prestigious luxury brand.
        </p>
        <button
          onClick={() => navigate('contact', { subject: 'Advisory Career Inquiry' })}
          className="px-6 py-2.5 bg-[#1A1A1A] hover:bg-[#B5945E] text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Contact Recruitment Desk
        </button>
      </div>
    </div>
  );
};

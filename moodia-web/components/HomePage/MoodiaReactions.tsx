'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MoodiaReactionsProps {
  onReactionSelect: (reaction: string) => void;
  selectedReaction: string | null;
}

const moodiaReactions = [
  { id: 'loved', emoji: '💖', label: 'Loved it', color: '#FF6B9D' },
  { id: 'mindblown', emoji: '🤯', label: 'Mind-blown', color: '#4ECDC4' },
  { id: 'cracked', emoji: '😂', label: 'Cracked me up', color: '#FFE66D' },
  { id: 'touched', emoji: '😭', label: 'Touched my soul', color: '#A8E6CF' },
  { id: 'fire', emoji: '🔥', label: 'Pure fire', color: '#FF8B94' },
  { id: 'uplifted', emoji: '🌈', label: 'Uplifted me', color: '#B4A7D6' }
];

export default function MoodiaReactions({ onReactionSelect, selectedReaction }: MoodiaReactionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="absolute bottom-full right-0 mb-4 bg-white/95 backdrop-blur-lg rounded-3xl p-4 shadow-2xl border border-white/20"
      style={{ minWidth: '200px' }}
    >
      <div className="grid grid-cols-2 gap-3">
        {moodiaReactions.map((reaction, index) => (
          <motion.button
            key={reaction.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.1,
              backgroundColor: `${reaction.color}20`
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReactionSelect(reaction.id)}
            className={`flex items-center gap-2 p-3 rounded-2xl transition-all duration-200 ${
              selectedReaction === reaction.id
                ? 'bg-white shadow-md border-2'
                : 'hover:bg-gray-50'
            }`}
            style={{
              borderColor: selectedReaction === reaction.id ? reaction.color : 'transparent'
            }}
          >
            <motion.span 
              className="text-2xl"
              animate={selectedReaction === reaction.id ? {
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {reaction.emoji}
            </motion.span>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800">
                {reaction.label}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Arrow pointing to the reaction button */}
      <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95" />
    </motion.div>
  );
}
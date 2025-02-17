import { motion } from 'framer-motion';
import { Clock, User, Tag,  } from 'lucide-react';

export const renderEventContent = (eventInfo: any) => {
  const { extendedProps, classNames } = eventInfo.event;
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'finished':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'encounter':
        return 'bg-purple-100 text-purple-800';
      case 'registered':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventBorderColor = (classes: string[]) => {
    if (classes.includes('appointment-pink')) return 'border-pink-300';
    if (classes.includes('appointment-green')) return 'border-green-300';
    if (classes.includes('appointment-blue')) return 'border-blue-300';
    return 'border-gray-300';
  };

  const getIconColor = (classes: string[]) => {
    if (classes.includes('appointment-pink')) return 'text-pink-500';
    if (classes.includes('appointment-green')) return 'text-green-500';
    if (classes.includes('appointment-blue')) return 'text-blue-500';
    return 'text-gray-500';
  };

  const borderColor = getEventBorderColor(classNames);
  const iconColor = getIconColor(classNames);

  return (
    <motion.div 
      className="p-2 h-full rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-1.5">
            <User className={`w-3.5 h-3.5 ${iconColor}`} />
            <span className="font-medium text-gray-800 text-sm">
              {extendedProps.patient}
            </span>
          </div>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(extendedProps.status)}`}>
            {extendedProps.status}
          </span>
        </div>
        
        <div className="flex items-center space-x-1.5 text-gray-600 text-xs mb-1">
          <Clock className={`w-3.5 h-3.5 ${iconColor}`} />
          <span>{eventInfo.timeText}</span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <Tag className={`w-3.5 h-3.5 ${iconColor}`} />
          <span className={`text-xs text-gray-700 bg-white px-2 py-0.5 rounded-full border ${borderColor}`}>
            {extendedProps.type}
          </span>
        </div>

        {extendedProps.note && (
          <div className="mt-2 text-xs px-2 py-1 bg-yellow-50 rounded text-yellow-800 flex items-start space-x-1.5">
            <span className="flex-shrink-0">📝</span>
            <span>{extendedProps.note}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default renderEventContent;
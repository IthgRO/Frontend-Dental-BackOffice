import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ClipboardList
} from 'lucide-react';

const menuItems = [
  {
    name: 'Dashboard',
    icon: LayoutDashboard,
    active: false,
    disabled: true
  },
  {
    name: 'Reservations',
    icon: Calendar,
    active: true,
    disabled: false
  },
  {
    name: 'Patients',
    icon: Users,
    active: false,
    disabled: true
  },
  {
    name: 'Staff List',
    icon: ClipboardList,
    active: false,
    disabled: true
  },
  {
    name: 'Settings',
    icon: Settings,
    active: false,
    disabled: true
  }
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 0,
          opacity: isOpen ? 1 : 0
        }}
        className="bg-white border-r h-screen overflow-hidden relative"
      >
        <div className="h-16 px-4 flex items-center border-b">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg font-bold text-gray-800 flex items-center space-x-2"
          >
            <Calendar className="w-6 h-6 text-blue-600" />
            <span>My Clinic</span>
          </motion.div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  className={`w-full flex items-center text-gray-600 p-2 rounded-lg space-x-2 transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-700'
                      : item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-gray-50'
                  }`}
                  disabled={item.disabled}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              </motion.li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-50 rounded-lg"
          >
            <h4 className="text-sm font-medium text-blue-900">Need Help?</h4>
            <p className="text-xs text-blue-700 mt-1">
              Check our documentation or contact support
            </p>
          </motion.div>
        </div>
      </motion.aside>

      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-20 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        {isOpen ? (
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </>
  );
};

export default Sidebar;
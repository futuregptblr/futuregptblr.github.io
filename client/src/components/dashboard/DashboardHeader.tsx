import React from 'react';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FG</span>
            </div>
            <span className="ml-2 text-xl font-bold text-blue-600">
              FutureGPT
            </span>
            <span className="ml-2 text-sm text-gray-500 bg-yellow-100 px-2 py-1 rounded-full">
              Premium
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search resources..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-yellow-500 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">John Doe</p>
              <p className="text-xs text-gray-500">Premium Member</p>
            </div>
            <div className="h-8 w-8 bg-gradient-to-r from-yellow-400 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 
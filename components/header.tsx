'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Search, Bell } from './Icons'

interface NotificationItem {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  description: string
  time: string
  unread: boolean
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'success',
      title: 'Transfer Successful',
      description: 'You sent Rs. 10,000.00 to Account ......4876',
      time: '5 mins ago',
      unread: true
    },
    {
      id: '2',
      type: 'warning',
      title: 'Security Alert',
      description: 'New login detected from Colombo, LK',
      time: '1 hour ago',
      unread: true
    },
    {
      id: '3',
      type: 'info',
      title: 'CEB Bill Due',
      description: 'Your CEB bill of Rs. 3,500.00 is due in 3 days',
      time: 'Yesterday',
      unread: false
    },
    {
      id: '4',
      type: 'success',
      title: 'Deposit Received',
      description: 'Received Rs. 4,500.00 from Account ......3423',
      time: '2 days ago',
      unread: false
    }
  ])

  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter(n => n.unread).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: false } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'warning':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      case 'info':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full flex items-center justify-between gap-4 py-4 px-6 md:px-8 bg-white/75 backdrop-blur-md border-b border-gray-200/40 transition-all duration-300">
      {/* Search Bar */}
      <div className="flex-1 max-w-md relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#9a5c97] transition-colors duration-200">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search anything..."
          className="w-full pl-10 pr-10 py-2 text-sm text-gray-800 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#9a5c97]/25 focus:border-[#9a5c97] transition-all duration-300"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            title="Clear search"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Actions (Notifications & Profile) */}
      <div className="flex items-center gap-4">
        {/* Notifications Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2.5 text-gray-600 hover:text-[#450043] hover:bg-gray-100/80 rounded-full transition-all duration-200 cursor-pointer focus:outline-none"
            aria-label="Toggle notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 min-w-5 px-1 items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Card */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden transform origin-top-right transition-all duration-200 ease-out">
              <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
                <span className="font-semibold text-gray-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs font-semibold text-[#9a5c97] hover:text-[#450043] transition-colors cursor-pointer"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleMarkAsRead(item.id)}
                      className={`flex gap-3 p-4 hover:bg-gray-50/80 transition-colors cursor-pointer relative ${
                        item.unread ? 'bg-purple-50/15' : ''
                      }`}
                    >
                      {getNotificationIcon(item.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <p className={`text-xs font-semibold truncate ${item.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{item.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                      {item.unread && (
                        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#9a5c97]" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-gray-400 text-sm">
                    No notifications
                  </div>
                )}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-center">
                <span className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-default">
                  Clear all notifications
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200/80 shadow-sm cursor-pointer hover:border-[#9a5c97]/50 transition-colors duration-200">
          <Image
            src="/avatar.png"
            alt="Profile Avatar"
            fill
            className="object-cover bg-white"
          />
        </div>
      </div>
    </header>
  )
}

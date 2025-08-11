import { useState } from 'react';
import React from 'react';
const ContactCenterDashboard = () => {
  const [activeTab, setActiveTab] = useState('callInfo');
  const [searchQuery, setSearchQuery] = useState(''); // Add this for directory search
  const [disposition, setDisposition] = useState('');

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left Navigation Sidebar */}
      <div className="w-[260px] bg-white border-r border-[#E2E8F0]">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <svg className="w-6 h-6 text-[#3B82F6]" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 15.5c-1.2 0-2.4-.2-3.6-.6-.3-.1-.7 0-1 .2l-2.2 2.2c-2.8-1.4-5.1-3.8-6.6-6.6l2.2-2.2c.3-.3.4-.7.2-1-.3-1.1-.5-2.3-.5-3.5 0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1 0 9.4 7.6 17 17 17 .6 0 1-.4 1-1v-3.5c0-.6-.4-1-1-1z"/>
            </svg>
            <span className="text-xl font-medium">Contact Center</span>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-[#F1F5F9] rounded-md text-[#475569]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
              <span>Dashboard</span>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 w-[260px] border-t border-[#E2E8F0] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F1F5F9] rounded-full"></div>
            <div>
              <div className="font-medium">John Agent</div>
              <div className="text-sm text-[#64748B]">Agent</div>
              <div className="text-sm text-[#64748B]">ID: A001</div>
            </div>
          </div>
          <button className="mt-4 flex items-center gap-2 text-[#64748B] hover:text-[#475569]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#1E293B]">Agent Dashboard</h1>
              <p className="text-[#64748B]">Welcome back, John Agent</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-[#475569]">Ready</span>
              </div>
              <span className="text-[#64748B]">Agent ID: A001</span>
            </div>
          </div>

          {/* Current Call Section */}
          <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'callInfo' && (
                <div>
                  <h3 className="text-base font-semibold text-[#1E293B] mb-1">Call Disposition</h3>
                  <p className="text-sm text-[#64748B] mb-4">Select a category for this call</p>
                  <select
                    value={disposition}
                    onChange={(e) => setDisposition(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-md text-[#64748B] bg-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                  >
                    <option value="">Select disposition...</option>
                    <option value="inquiry">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Issue</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}
              
              {activeTab === 'missedCalls' && (
                <div>
                  <h3 className="text-sm text-[#64748B] mb-4">Recent calls that were not answered</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#1E293B]">+1 555-123-4567</div>
                        <div className="text-sm text-[#64748B]">10:36 AM via General Inquiries</div>
                      </div>
                      <button className="text-[#3B82F6] hover:text-[#2563EB] transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        Call Back
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#1E293B]">+1 555-987-6543</div>
                        <div className="text-sm text-[#64748B]">09:45 AM via Technical Support</div>
                      </div>
                      <button className="text-[#3B82F6] hover:text-[#2563EB] transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        Call Back
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'voicemail' && (
                <div>
                  <h3 className="text-sm text-[#64748B] mb-4">Recent voicemail messages</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#1E293B]">+1 555-222-3333</div>
                        <div className="text-sm text-[#64748B]">2023-04-11 09:15 (0:45)</div>
                      </div>
                      <button className="text-[#3B82F6] hover:text-[#2563EB] transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                        </svg>
                        Listen
                      </button>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-[#1E293B]">+1 555-444-5555</div>
                        <div className="text-sm text-[#64748B]">2023-04-10 16:30 (1:22)</div>
                      </div>
                      <button className="text-[#3B82F6] hover:text-[#2563EB] transition-colors flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                        </svg>
                        Listen
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'directory' && (
                <div>
                  <h3 className="text-sm text-[#64748B] mb-4">Search for contacts</h3>
                  <div className="relative mb-6">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, department or extension"
                      className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent"
                    />
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <div className="space-y-4">
                    {[
                      { name: 'John Smith', department: 'Sales', ext: '101' },
                      { name: 'Sarah Johnson', department: 'Support', ext: '102' },
                      { name: 'Mike Williams', department: 'Billing', ext: '103' },
                      { name: 'Emily Davis', department: 'IT', ext: '104' },
                      { name: 'Robert Wilson', department: 'HR', ext: '105' }
                    ].map((contact, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-[#F1F5F9] rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-[#64748B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-[#1E293B]">{contact.name}</div>
                            <div className="text-sm text-[#64748B]">{contact.department} • Ext: {contact.ext}</div>
                          </div>
                        </div>
                        <button className="text-[#3B82F6] hover:text-[#2563EB] transition-colors">Call</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-[300px] p-8 border-l border-[#E2E8F0]">
          {/* Queue Status */}
          <div className="mb-8">
            <h2 className="text-[#1E293B] font-semibold mb-1">Queue Status</h2>
            <p className="text-sm text-[#64748B] mb-4">Calls waiting in your queues</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">General Inquiries</span>
                <span className="bg-[#EFF6FF] text-[#3B82F6] px-3 py-1 rounded-full text-sm">3 calls</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Technical Support</span>
                <span className="bg-[#EFF6FF] text-[#3B82F6] px-3 py-1 rounded-full text-sm">1 call</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Billing</span>
                <span className="bg-[#EFF6FF] text-[#3B82F6] px-3 py-1 rounded-full text-sm">0 calls</span>
              </div>
            </div>
          </div>

          {/* Daily Stats */}
          <div>
            <h2 className="text-[#1E293B] font-semibold mb-1">Daily Stats</h2>
            <p className="text-sm text-[#64748B] mb-4">Your call statistics for today</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Calls Handled</span>
                <span className="text-[#1E293B]">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Average Handle Time</span>
                <span className="text-[#1E293B]">3:45</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Longest Call</span>
                <span className="text-[#1E293B]">8:12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#475569]">Missed Calls</span>
                <span className="text-[#1E293B]">2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCenterDashboard;
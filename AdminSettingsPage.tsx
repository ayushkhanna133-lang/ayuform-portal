import React, { useState } from 'react';
import { Save, Image as ImageIcon, Upload, Globe, Mail, Phone, MapPin, ShieldAlert, Download, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  const handleBackup = () => {
    alert("Backup process initiated. This may take a few minutes.");
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      alert('Image uploaded successfully! (Mock)');
    };
    input.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-blue-950">Portal Settings</h1>
        <p className="text-sm text-blue-900/60 mt-1">Manage your website configuration, theme, and system options.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* General Information */}
          <section>
            <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2 border-b border-blue-50/50 pb-2">
              <Globe className="text-blue-500" size={20} /> General Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Website Name</label>
                <input 
                  type="text" 
                  defaultValue="AyuForm Portal"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Tagline</label>
                <input 
                  type="text" 
                  defaultValue="India's #1 Government Job Portal"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Branding & Logo */}
          <section>
            <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2 border-b border-blue-50/50 pb-2">
              <ImageIcon className="text-blue-500" size={20} /> Branding & Logo
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Logo */}
              <div className="flex-1 flex flex-col sm:flex-row gap-6 items-start bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                  <span className="text-2xl font-bold">AF</span>
                </div>
                <div className="flex-grow space-y-3">
                  <h3 className="font-semibold text-blue-950">Site Logo</h3>
                  <p className="text-xs text-blue-900/70">Recommended size: 256x256px.</p>
                  <button onClick={handleUploadClick} className="flex items-center gap-2 bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                    <Upload size={14} /> Upload Logo
                  </button>
                </div>
              </div>

              {/* Favicon */}
              <div className="flex-1 flex flex-col sm:flex-row gap-6 items-start bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl">
                <div className="w-20 h-20 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-900 shrink-0 shadow-sm">
                  <Globe size={32} className="opacity-20" />
                </div>
                <div className="flex-grow space-y-3">
                  <h3 className="font-semibold text-blue-950">Favicon</h3>
                  <p className="text-xs text-blue-900/70">Shown in browser tabs (32x32px or 64x64px .ico or .png)</p>
                  <button onClick={handleUploadClick} className="flex items-center gap-2 bg-white border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-colors">
                    <Upload size={14} /> Upload Favicon
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section>
            <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2 border-b border-blue-50/50 pb-2">
              <Mail className="text-blue-500" size={20} /> Contact Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1 flex items-center gap-1.5"><Mail size={14} className="text-blue-400"/> Support Email</label>
                <input 
                  type="email" 
                  defaultValue="contact@ayuform.com"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1 flex items-center gap-1.5"><Phone size={14} className="text-blue-400"/> Phone Number</label>
                <input 
                  type="text" 
                  defaultValue="+91 (800) 123-4567"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1 flex items-center gap-1.5"><MapPin size={14} className="text-blue-400"/> Office Address</label>
                <input 
                  type="text" 
                  defaultValue="New Delhi, India 110001"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Theme & Display */}
          <section>
            <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2 border-b border-blue-50/50 pb-2">
              <Moon className="text-blue-500" size={20} /> Theme & Display
            </h2>
            <div className="flex items-center justify-between bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl">
              <div>
                <h3 className="font-semibold text-blue-950">Dark Mode Support</h3>
                <p className="text-xs text-blue-900/60 mt-0.5">Enable a dark color scheme for the website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </section>

          {/* System & Maintenance */}
          <section>
            <h2 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2 border-b border-blue-50/50 pb-2">
              <ShieldAlert className="text-blue-500" size={20} /> System & Maintenance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-orange-50/50 border border-orange-100 p-4 rounded-2xl">
                <div>
                  <h3 className="font-semibold text-orange-950">Maintenance Mode</h3>
                  <p className="text-xs text-orange-900/70 mt-0.5">Display a maintenance screen to public users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={maintenanceMode} onChange={(e) => setMaintenanceMode(e.target.checked)} />
                  <div className="w-11 h-6 bg-orange-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl">
                <div>
                  <h3 className="font-semibold text-blue-950">Backup & Restore</h3>
                  <p className="text-xs text-blue-900/60 mt-0.5">Download a complete backup of your database</p>
                </div>
                <button 
                  onClick={handleBackup}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  <Download size={16} /> Export Backup
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50/30 border border-blue-100/50 p-4 rounded-2xl">
                <div>
                  <h3 className="font-semibold text-blue-950">System Version</h3>
                  <p className="text-xs text-blue-900/60 mt-0.5">Current Version: v1.0.0 (Latest)</p>
                </div>
                <button 
                  onClick={() => alert('You are on the latest version.')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
                >
                  Check for Updates
                </button>
              </div>
            </div>
          </section>

        </div>
        
        {/* Action Bar */}
        <div className="bg-blue-50/50 p-6 border-t border-blue-100/50 flex justify-end gap-3">
          <button className="bg-white border border-blue-100 text-blue-900 px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
               <span className="flex items-center gap-2">
                 <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...
               </span>
            ) : (
               <span className="flex items-center gap-2"><Save size={16} /> Save Changes</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LatestJobsPage } from './pages/LatestJobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminJobEditorPage } from './pages/admin/AdminJobEditorPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminMediaLibraryPage } from './pages/admin/AdminMediaLibraryPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminCommentsPage } from './pages/admin/AdminCommentsPage';

import { AdminFormsPage } from './pages/admin/AdminFormsPage';
import { AdminFormEditorPage } from './pages/admin/AdminFormEditorPage';

import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminAnnouncementsPage } from './pages/admin/AdminAnnouncementsPage';




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs" element={<LatestJobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="jobs" element={<AdminJobsPage />} />
          <Route path="forms" element={<AdminFormsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="announcements" element={<AdminAnnouncementsPage />} />

          <Route path="forms/new" element={<AdminFormEditorPage />} />
          <Route path="forms/edit/:id" element={<AdminFormEditorPage />} />

          <Route path="jobs/new" element={<AdminJobEditorPage />} />
          <Route path="jobs/edit/:id" element={<AdminJobEditorPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="media" element={<AdminMediaLibraryPage />} />
          <Route path="comments" element={<AdminCommentsPage />} />
          <Route path="messages" element={<AdminMessagesPage />} />
          <Route path="notifications" element={<AdminNotificationsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}



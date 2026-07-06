import { supabase, isSupabaseConfigured } from '../../supabase';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Eye, CheckCircle, Trash2, Image as ImageIcon, Upload, 
  Calendar, Building2, Link as LinkIcon, Settings, AlertCircle, FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';


import { JobData } from '../../types/job';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export function AdminJobEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [department, setDepartment] = useState('');
  const [salary, setSalary] = useState('');
  const [vacancies, setVacancies] = useState('');
  const [ageLimit, setAgeLimit] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [applicationFee, setApplicationFee] = useState('');
  const [applicationStart, setApplicationStart] = useState('');
  const [lastDateApply, setLastDateApply] = useState('');
  const [examDate, setExamDate] = useState('');
  const [applyLink, setApplyLink] = useState('');
  const [notificationPdf, setNotificationPdf] = useState('');
  const [officialWebsite, setOfficialWebsite] = useState('');
  const [status, setStatus] = useState('draft');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDesc, setSeoDesc] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
          const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
          if (data && !error) {
            setTitle(data.title || '');
            setShortDesc(data.shortDesc || '');
            setFullDesc(data.fullDesc || '');
            setDepartment(data.department || '');
            setSalary(data.salary || '');
            setVacancies(data.vacancies || '');
            setAgeLimit(data.ageLimit || '');
            setEligibility(data.eligibility || '');
            setApplicationFee(data.applicationFee || '');
            setApplicationStart(data.applicationStart || '');
            setLastDateApply(data.lastDateApply || '');
            setExamDate(data.examDate || '');
            setApplyLink(data.applyLink || '');
            setNotificationPdf(data.notificationPdf || '');
            setOfficialWebsite(data.officialWebsite || '');
            setStatus(data.status || 'draft');
            setCategory(data.category || '');
            setTags(data.tags || '');
            setSeoTitle(data.seoTitle || '');
            setSeoDesc(data.seoDesc || '');
            setThumbnailUrl(data.thumbnailUrl || '');
          }
        } catch (error) {
          console.warn("Error fetching document:", error);
        }
      };
      fetchJob();
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadProgress(10);
      try {
        const { error, data } = await supabase.storage.from('thumbnails').upload(`${Date.now()}_${file.name}`, file);
        if (data && !error) {
           const { data: urlData } = await supabase.storage.from('thumbnails').getPublicUrl(data.path);
           setThumbnailUrl(urlData.publicUrl);
        }
      } catch (err) {
        console.warn("Upload failed", err);
      } finally {
        setUploadProgress(0);
      }
    }
  };

  const handleSave = async (type: 'draft' | 'publish') => {
    if (type === 'publish') setIsPublishing(true);
    else setIsSaving(true);
    
    try {
      const jobData = {
        title, shortDesc, fullDesc, department, salary, vacancies, ageLimit, 
        eligibility, applicationFee, applicationStart, lastDateApply, examDate, 
        applyLink, notificationPdf, officialWebsite, status: type === 'publish' ? 'published' : 'draft', 
        category, tags, seoTitle, seoDesc, thumbnailUrl
      };

      if (!id) {
        const { data, error } = await supabase.from('jobs').insert([jobData]).select('id').single();
        if (data) {
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          navigate(`/admin/jobs/edit/${data.id}`);
        }
      } else {
        await supabase.from('jobs').update(jobData).eq('id', id);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.warn("Error saving job", error);
      alert("Failed to save job");
    } finally {
      setIsPublishing(false);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (id && window.confirm("Are you sure you want to delete this post?")) {
      if (!isSupabaseConfigured) { console.warn('Supabase not configured'); return; }
      try {
        await supabase.from('jobs').delete().eq('id', id);
        navigate('/admin/jobs');
      } catch (error) {
        console.warn("Error deleting job", error);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {/* Top Bar / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sticky top-16 z-20 bg-slate-50/80 backdrop-blur-md py-4 border-b border-blue-100/50">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Add New Post</h1>
          <p className="text-sm text-blue-900/60 mt-1">Create a new job notification, result, or admit card.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="hidden sm:flex items-center gap-2 bg-white border border-blue-100 text-blue-900 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors shadow-sm">
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={() => handleSave('draft')}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors shadow-sm disabled:opacity-70"
          >
            {isSaving ? <div className="w-4 h-4 border-2 border-blue-700/30 border-t-blue-700 rounded-full animate-spin" /> : <Save size={16} />}
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('publish')}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 disabled:opacity-70"
          >
            {isPublishing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={16} />}
            Publish
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-2xl flex items-center justify-between mb-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <p className="font-medium text-sm">Post saved successfully!</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="text-green-600 hover:text-green-800">
            &times;
          </button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area (Left) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Info */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5">
            <h2 className="text-lg font-bold text-blue-950 border-b border-blue-50/50 pb-2 flex items-center gap-2">
              <FileText size={18} className="text-blue-500"/> Basic Information
            </h2>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Post Title <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SSC CGL 2026 Notification"
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              />
              <div className="flex justify-end text-xs text-blue-900/40">{title.length}/100</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Short Description <span className="text-red-500">*</span></label>
              <textarea 
                rows={3}
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                placeholder="Brief summary of the post..."
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
              />
              <div className="flex justify-end text-xs text-blue-900/40">{shortDesc.length}/250</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1 flex justify-between">
                <span>Full Description (Rich Text)</span>
              </label>
              <div className="bg-white rounded-xl overflow-hidden">
                <ReactQuill 
                  theme="snow" 
                  value={fullDesc} 
                  onChange={setFullDesc} 
                  className="bg-white text-blue-950"
                  style={{ minHeight: '200px' }}
                />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-6">
            <h2 className="text-lg font-bold text-blue-950 border-b border-blue-50/50 pb-2 flex items-center gap-2">
              <Building2 size={18} className="text-blue-500"/> Specific Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Department/Organization</label>
                <input 
                  type="text" 
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Staff Selection Commission"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Salary / Pay Scale</label>
                <input 
                  type="text" 
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. Level 7 (₹ 44,900 to 1,42,400)"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Total Vacancies</label>
                <input 
                  type="text" 
                  value={vacancies}
                  onChange={(e) => setVacancies(e.target.value)}
                  placeholder="e.g. 1500+"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Age Limit</label>
                <input 
                  type="text" 
                  value={ageLimit}
                  onChange={(e) => setAgeLimit(e.target.value)}
                  placeholder="e.g. 18 to 27 Years"
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Eligibility/Qualification</label>
              <textarea 
                rows={2}
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                placeholder="e.g. Bachelor's Degree in any stream."
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Application Fee Details</label>
              <textarea 
                rows={2}
                value={applicationFee}
                onChange={(e) => setApplicationFee(e.target.value)}
                placeholder="e.g. General/OBC: ₹100, SC/ST: Nil"
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
              />
            </div>
          </div>

          {/* Dates & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
              <h2 className="text-lg font-bold text-blue-950 border-b border-blue-50/50 pb-2 flex items-center gap-2">
                <Calendar size={18} className="text-blue-500"/> Important Dates
              </h2>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Application Start</label>
                <input 
                  type="date" 
                  value={applicationStart}
                  onChange={(e) => setApplicationStart(e.target.value)}
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Last Date to Apply</label>
                <input 
                  type="date" 
                  value={lastDateApply}
                  onChange={(e) => setLastDateApply(e.target.value)}
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Exam Date (Optional)</label>
                <input 
                  type="text" 
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  placeholder="e.g. August 2026" 
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
              <h2 className="text-lg font-bold text-blue-950 border-b border-blue-50/50 pb-2 flex items-center gap-2">
                <LinkIcon size={18} className="text-blue-500"/> Important Links
              </h2>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Apply Online Link</label>
                <input 
                  type="url" 
                  value={applyLink}
                  onChange={(e) => setApplyLink(e.target.value)}
                  placeholder="https://" 
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Official Notification (PDF)</label>
                <input 
                  type="url" 
                  value={notificationPdf}
                  onChange={(e) => setNotificationPdf(e.target.value)}
                  placeholder="https://" 
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-blue-950 ml-1">Official Website</label>
                <input 
                  type="url" 
                  value={officialWebsite}
                  onChange={(e) => setOfficialWebsite(e.target.value)}
                  placeholder="https://" 
                  className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all" 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Area (Right) */}
        <div className="space-y-6">
          
          {/* Status & Category */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Status</label>
              <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Category <span className="text-red-500">*</span></label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
              >
                <option value="">Select Category</option>
                <option value="latest-jobs">Latest Jobs</option>
                <option value="results">Results</option>
                <option value="admit-cards">Admit Cards</option>
                <option value="answer-keys">Answer Keys</option>
                <option value="syllabus">Syllabus</option>
                <option value="admissions">Admissions</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Tags (Comma separated)</label>
              <input 
                type="text" 
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. SSC, CGL, Graduate"
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
            <h2 className="text-sm font-semibold text-blue-950 mb-3">Post Thumbnail</h2>
            
            <div 
              className="border-2 border-dashed border-blue-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-blue-50/30 hover:bg-blue-50 transition-colors cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {thumbnailUrl ? (
                <img src={thumbnailUrl} alt="Thumbnail" className="max-h-32 rounded-lg mb-2 object-cover" />
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <ImageIcon size={24} />
                  </div>
                  <p className="text-sm font-semibold text-blue-950">Click to upload image</p>
                  <p className="text-xs text-blue-900/50 mt-1">PNG, JPG, WebP up to 2MB</p>
                </>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-blue-100 rounded-full h-2 mt-4">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>

          {/* SEO Meta */}
          <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-4">
            <h2 className="text-lg font-bold text-blue-950 border-b border-blue-50/50 pb-2 flex items-center gap-2">
              <Settings size={18} className="text-blue-500"/> SEO Optimization
            </h2>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1 flex justify-between">
                <span>SEO Title</span>
              </label>
              <input 
                type="text" 
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                placeholder="Custom title for search engines"
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <div className="flex justify-end text-xs text-blue-900/40">{seoTitle.length}/60</div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-blue-950 ml-1">Meta Description</label>
              <textarea 
                rows={4}
                value={seoDesc}
                onChange={(e) => setSeoDesc(e.target.value)}
                placeholder="Optimized description for search results..."
                className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y"
              />
              <div className="flex justify-end text-xs text-blue-900/40">{seoDesc.length}/160</div>
            </div>
            
            {seoDesc.length > 160 && (
              <div className="flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>Meta description should ideally be under 160 characters for best SEO results.</span>
              </div>
            )}
          </div>
          
          {/* Danger Zone (if editing existing) */}
          {id && (
            <div className="bg-red-50/50 border border-red-100 p-6 rounded-3xl mt-6">
              <h2 className="text-sm font-bold text-red-900 mb-2 flex items-center gap-2">
                Danger Zone
              </h2>
              <p className="text-xs text-red-800/70 mb-4">Once you delete a post, there is no going back. Please be certain.</p>
              <button 
                onClick={handleDelete}
                className="w-full flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-50 hover:text-red-700 transition-colors shadow-sm"
              >
                <Trash2 size={16} /> Delete Post
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

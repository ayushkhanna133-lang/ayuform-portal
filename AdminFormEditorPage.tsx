import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../supabase';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Category } from '../../types';

export function AdminFormEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    pdf_link: '',
    website_link: '',
    eligibility: '',
    last_date: '',
    fees: '',
    state: '',
    tags: '',
    status: 'published'
  });

  useEffect(() => {
    const fetchDependencies = async () => {
      if (!isSupabaseConfigured) return;
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    };
    fetchDependencies();
  }, []);

  useEffect(() => {
    const fetchForm = async () => {
      if (isEditMode && isSupabaseConfigured) {
        setLoading(true);
        const { data, error } = await supabase.from('forms').select('*').eq('id', id).single();
        if (data) {
          setFormData({
            name: data.name || '',
            description: data.description || '',
            category_id: data.category_id || '',
            pdf_link: data.pdf_link || '',
            website_link: data.website_link || '',
            eligibility: data.eligibility || '',
            last_date: data.last_date ? data.last_date.split('T')[0] : '',
            fees: data.fees || '',
            state: data.state || '',
            tags: data.tags ? data.tags.join(', ') : '',
            status: data.status || 'published'
          });
        }
        setLoading(false);
      }
    };
    fetchForm();
  }, [id, isEditMode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!isSupabaseConfigured) {
      alert("Supabase not configured!");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id || null,
        pdf_link: formData.pdf_link,
        website_link: formData.website_link,
        eligibility: formData.eligibility,
        last_date: formData.last_date ? new Date(formData.last_date).toISOString() : null,
        fees: formData.fees,
        state: formData.state,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        status: formData.status,
        updated_at: new Date().toISOString(),
      };

      if (isEditMode) {
        await supabase.from('forms').update(payload).eq('id', id);
        // Also increment version
        // Ideally handled via DB trigger, or doing it explicitly here:
        const { data: currentForm } = await supabase.from('forms').select('version').eq('id', id).single();
        if (currentForm) {
            await supabase.from('forms').update({ version: currentForm.version + 1 }).eq('id', id);
            await supabase.from('form_versions').insert({ form_id: id, version: currentForm.version + 1, changes: 'Updated via admin' });
        }
      } else {
        const { data: newForm } = await supabase.from('forms').insert([payload]).select('id').single();
        if (newForm) {
            await supabase.from('form_versions').insert({ form_id: newForm.id, version: 1, changes: 'Initial version' });
        }
      }
      navigate('/admin/forms');
    } catch (error) {
      console.warn("Error saving form", error);
      alert("Failed to save form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/admin/forms" className="p-2 bg-white border border-blue-100 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-blue-950">{isEditMode ? 'Edit Form' : 'Add New Form'}</h1>
            <p className="text-sm text-blue-900/60 mt-1">{isEditMode ? 'Update form details below' : 'Create a new form listing'}</p>
          </div>
        </div>
        <button 
          onClick={handleSave} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {loading ? 'Saving...' : 'Save Form'}
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Form Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Category</label>
            <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-blue-950">Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"></textarea>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">PDF Link</label>
            <input type="text" name="pdf_link" value={formData.pdf_link} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Website Link</label>
            <input type="text" name="website_link" value={formData.website_link} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Eligibility</label>
            <input type="text" name="eligibility" value={formData.eligibility} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Last Date</label>
            <input type="date" name="last_date" value={formData.last_date} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Fees</label>
            <input type="text" name="fees" value={formData.fees} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">State</label>
            <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Tags (comma separated)</label>
            <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-blue-950">Status</label>
            <select name="status" value={formData.status} onChange={handleInputChange} className="w-full bg-blue-50/50 border border-blue-100/50 rounded-xl py-2.5 px-4 text-blue-950 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

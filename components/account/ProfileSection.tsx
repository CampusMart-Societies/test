import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { Button } from '../Button';
import { SCHOOL_LEVELS, GRADE_LEVELS_BY_SCHOOL } from '../../constants';
import { UserCircleIcon, TwitterIcon, LinkedInIcon, GithubIcon } from '../icons/Icons';

interface ProfileSectionProps {
    user: User;
    onUpdateUser: (updatedProfile: Partial<User>) => boolean;
    showToast: (message: string, type?: 'success' | 'error') => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = React.memo(({ user, onUpdateUser, showToast }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        schoolLevel: user.schoolLevel,
        grade: user.grade,
        profilePictureUrl: user.profilePictureUrl || '',
        bio: user.bio || '',
        twitterUrl: user.twitterUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        githubUrl: user.githubUrl || '',
    });
    const [gradeOptions, setGradeOptions] = useState<string[]>(GRADE_LEVELS_BY_SCHOOL[user.schoolLevel] || []);
    const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
    
    useEffect(() => {
        setFormData({
            name: user.name,
            email: user.email,
            schoolLevel: user.schoolLevel,
            grade: user.grade,
            profilePictureUrl: user.profilePictureUrl || '',
            bio: user.bio || '',
            twitterUrl: user.twitterUrl || '',
            linkedinUrl: user.linkedinUrl || '',
            githubUrl: user.githubUrl || '',
        });
        setGradeOptions(GRADE_LEVELS_BY_SCHOOL[user.schoolLevel] || []);
    }, [user]);
    
    useEffect(() => {
        if (isEditing) {
            setErrors({}); // Clear errors when entering edit mode
        }
    }, [isEditing]);

    const handleSchoolLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSchoolLevel = e.target.value;
        setFormData(prev => ({ ...prev, schoolLevel: newSchoolLevel, grade: '' }));
        setGradeOptions(GRADE_LEVELS_BY_SCHOOL[newSchoolLevel] || []);
        if (errors.schoolLevel || errors.grade) {
            setErrors(prev => ({ ...prev, schoolLevel: null, grade: null }));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB size limit
                showToast('Image file must be under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePictureUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const urlRegex = /^(https|http):\/\/[^\s$.?#].[^\s]*$/;
        if (value && !urlRegex.test(value)) {
            setErrors(prev => ({ ...prev, [name]: 'Please enter a valid URL.' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string | null } = {};
        if (!formData.name.trim()) newErrors.name = 'Full name is required.';
        if (!formData.email.trim()) {
            newErrors.email = 'Email address is required.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
             newErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.schoolLevel) newErrors.schoolLevel = 'School level is required.';
        if (!formData.grade) newErrors.grade = 'Grade level is required.';
        
        const urlRegex = /^(https|http):\/\/[^\s$.?#].[^\s]*$/;
        if (formData.twitterUrl && !urlRegex.test(formData.twitterUrl)) {
            newErrors.twitterUrl = 'Please enter a valid URL.';
        }
        if (formData.linkedinUrl && !urlRegex.test(formData.linkedinUrl)) {
            newErrors.linkedinUrl = 'Please enter a valid URL.';
        }
        if (formData.githubUrl && !urlRegex.test(formData.githubUrl)) {
            newErrors.githubUrl = 'Please enter a valid URL.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            const success = onUpdateUser(formData);
            if (success) {
                setIsEditing(false);
            } else {
                // This case happens on duplicate email. The parent App.tsx shows a toast.
                // Add field-specific error here.
                setErrors({ email: 'This email is already in use by another account.' });
            }
        } else {
            showToast('Please fix the errors before saving.');
        }
    };

    const handleCancel = () => {
        setFormData({ 
            name: user.name, 
            email: user.email,
            schoolLevel: user.schoolLevel,
            grade: user.grade, 
            profilePictureUrl: user.profilePictureUrl || '',
            bio: user.bio || '',
            twitterUrl: user.twitterUrl || '',
            linkedinUrl: user.linkedinUrl || '',
            githubUrl: user.githubUrl || '',
        });
        setGradeOptions(GRADE_LEVELS_BY_SCHOOL[user.schoolLevel] || []);
        setIsEditing(false);
        setErrors({}); // Also clear errors on cancel
    };

    const formInputClass = "mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 shadow-sm placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 disabled:bg-slate-200/50 dark:disabled:bg-slate-800/30 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed";
    const formLabelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";
    const optionClass = "text-slate-800 bg-white dark:text-slate-100 dark:bg-slate-800";
    const errorInputClass = "border-red-500/50 focus:border-red-500 focus:ring-red-500";
    const errorTextClass = "mt-1 text-xs text-red-400";

    const hasSocialLinks = formData.twitterUrl || formData.linkedinUrl || formData.githubUrl;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Information</h3>
                {!isEditing && (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
            </div>

            <form onSubmit={handleSaveChanges}>
                <div className="space-y-6">
                     <div className="flex items-center gap-5">
                        {formData.profilePictureUrl ? (
                            <img src={formData.profilePictureUrl} alt="Profile Preview" className="h-24 w-24 rounded-full object-cover bg-slate-300 dark:bg-slate-700" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                                <UserCircleIcon className="h-16 w-16 text-slate-400 dark:text-slate-500" />
                            </div>
                        )}
                        {isEditing && (
                            <div>
                                <label htmlFor="profile-picture-upload" className="cursor-pointer bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                                    Upload Picture
                                </label>
                                <input 
                                    id="profile-picture-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Max file size: 2MB.</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <label htmlFor="name" className={formLabelClass}>Full name</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} disabled={!isEditing} className={`${formInputClass} ${errors.name ? errorInputClass : ''}`} required />
                        {errors.name && <p className={errorTextClass}>{errors.name}</p>}
                    </div>
                    <div>
                        <label htmlFor="bio" className={formLabelClass}>Bio</label>
                        {isEditing ? (
                             <textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} disabled={!isEditing} className={formInputClass} rows={3} placeholder="Tell us a little about yourself..."/>
                        ) : (
                            <p className="mt-1 text-sm text-slate-700 dark:text-slate-300 min-h-[2.5rem]">
                                {formData.bio || <span className="text-slate-400 dark:text-slate-500">No bio provided.</span>}
                            </p>
                        )}
                    </div>
                     <div>
                        <label htmlFor="email" className={formLabelClass}>Email Address</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} disabled={!isEditing} className={`${formInputClass} ${errors.email ? errorInputClass : ''}`} required />
                        {errors.email && <p className={errorTextClass}>{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="schoolLevel" className={formLabelClass}>School Level</label>
                        <select id="schoolLevel" name="schoolLevel" value={formData.schoolLevel} onChange={handleSchoolLevelChange} disabled={!isEditing} className={`${formInputClass} ${errors.schoolLevel ? errorInputClass : ''}`} required>
                             {SCHOOL_LEVELS.map((level) => (
                                <option key={level} value={level} className={optionClass}>{level}</option>
                            ))}
                        </select>
                        {errors.schoolLevel && <p className={errorTextClass}>{errors.schoolLevel}</p>}
                    </div>
                    <div>
                        <label htmlFor="grade" className={formLabelClass}>Grade Level</label>
                        <select id="grade" name="grade" value={formData.grade} onChange={handleInputChange} disabled={!isEditing || !formData.schoolLevel} className={`${formInputClass} ${errors.grade ? errorInputClass : ''}`} required>
                             {gradeOptions.map((level) => (
                                <option key={level} value={level} className={optionClass}>{level}</option>
                            ))}
                        </select>
                        {errors.grade && <p className={errorTextClass}>{errors.grade}</p>}
                    </div>

                    {isEditing ? (
                         <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                             <div>
                                <label htmlFor="twitterUrl" className={formLabelClass}>Twitter URL</label>
                                <input type="url" id="twitterUrl" name="twitterUrl" value={formData.twitterUrl} onChange={handleInputChange} onBlur={handleUrlBlur} className={`${formInputClass} ${errors.twitterUrl ? errorInputClass : ''}`} placeholder="https://twitter.com/username" />
                                {errors.twitterUrl && <p className={errorTextClass}>{errors.twitterUrl}</p>}
                            </div>
                             <div>
                                <label htmlFor="linkedinUrl" className={formLabelClass}>LinkedIn URL</label>
                                <input type="url" id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} onBlur={handleUrlBlur} className={`${formInputClass} ${errors.linkedinUrl ? errorInputClass : ''}`} placeholder="https://linkedin.com/in/username" />
                                {errors.linkedinUrl && <p className={errorTextClass}>{errors.linkedinUrl}</p>}
                            </div>
                             <div>
                                <label htmlFor="githubUrl" className={formLabelClass}>GitHub URL</label>
                                <input type="url" id="githubUrl" name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} onBlur={handleUrlBlur} className={`${formInputClass} ${errors.githubUrl ? errorInputClass : ''}`} placeholder="https://github.com/username" />
                                {errors.githubUrl && <p className={errorTextClass}>{errors.githubUrl}</p>}
                            </div>
                         </div>
                    ) : (
                        hasSocialLinks && (
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h4 className={formLabelClass}>Social Links</h4>
                                <div className="mt-2 flex items-center gap-4">
                                    {formData.twitterUrl && (
                                        <a href={formData.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                            <TwitterIcon className="h-6 w-6" />
                                        </a>
                                    )}
                                    {formData.linkedinUrl && (
                                        <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                            <LinkedInIcon className="h-6 w-6" />
                                        </a>
                                    )}
                                    {formData.githubUrl && (
                                        <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
                                            <GithubIcon className="h-6 w-6" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
                {isEditing && (
                    <div className="mt-8 flex justify-end gap-3">
                        <Button type="button" variant="secondary" onClick={handleCancel}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                )}
            </form>
        </div>
    );
});
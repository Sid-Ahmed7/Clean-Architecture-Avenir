'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, ContactFormData } from '@/lib/validation/contactSchema';
import FormField from './FormField';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function ContactForm() {
  const t = useTranslations('landing.contact.form');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema(t)),
    mode: 'onBlur',
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(t('submitError'));
      }

      setSubmitStatus('success');
      reset();

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      setSubmitStatus('error');
    } finally{
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        label={t('name')}
        name="name"
        type="text"
        placeholder={t('namePlaceholder')}
        error={errors.name}
        register={register}
        required
      />

      <FormField
        label={t('email')}
        name="email"
        type="email"
        placeholder={t('emailPlaceholder')}
        error={errors.email}
        register={register}
        required
      />

      <FormField
        label={t('subject')}
        name="subject"
        type="text"
        placeholder={t('subjectPlaceholder')}
        error={errors.subject}
        register={register}
        required
      />

      <FormField
        label={t('message')}
        name="message"
        type="textarea"
        placeholder={t('messagePlaceholder')}
        error={errors.message}
        register={register}
        required
        rows={6}
      />

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-800">
          <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <p className="text-sm font-medium">
            {t('success')}
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-800">
          <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium">
            {t('error')}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t('sending')}</span>
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            <span>{t('submit')}</span>
          </>
        )}
      </button>
    </form>
  );
}

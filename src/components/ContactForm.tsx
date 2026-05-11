// Structured as static HTML for HubSpot compliance — same pattern as NewsletterForm.
// HubSpot tracking script captures the submission via form field sniffing.
import React, {startTransition, useState} from 'react';
import {ArrowTipIcon} from '@site/src/components/icons';

const TOPICS = [
  'Enterprise inquiry',
  'Partnership',
  'Technical question',
  'Press / media',
  'Other',
] as const;

type ContactFormProps = {
  onSuccess?: () => void;
};

export default function ContactForm({onSuccess}: ContactFormProps) {
  const [fields, setFields] = useState({
    name: '',
    email: '',
    company: '',
    topic: '',
    message: '',
  });
  const [showThankYou, setShowThankYou] = useState(false);

  function set(key: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields((prev) => ({...prev, [key]: e.target.value}));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      onSuccess?.();
      startTransition(() =>
        setFields({name: '', email: '', company: '', topic: '', message: ''}),
      );
    }, 4000);
  }

  if (showThankYou) {
    return (
      <div className="lr-contact-thanks">
        <h3>Message received.</h3>
        <p>We'll get back to you within one business day.</p>
      </div>
    );
  }

  return (
    <form method="POST" action="#" className="lr-contact-form" onSubmit={handleSubmit}>
      <div className="lr-contact-form__row">
        <label className="lr-contact-form__field">
          <span>Name</span>
          <input
            type="text"
            name="name"
            value={fields.name}
            required
            placeholder="Ada Lovelace"
            onChange={set('name')}
          />
        </label>
        <label className="lr-contact-form__field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={fields.email}
            required
            placeholder="you@company.dev"
            onChange={set('email')}
          />
        </label>
      </div>

      <div className="lr-contact-form__row">
        <label className="lr-contact-form__field">
          <span>Company <em>(optional)</em></span>
          <input
            type="text"
            name="company"
            value={fields.company}
            placeholder="Acme Corp"
            onChange={set('company')}
          />
        </label>
        <label className="lr-contact-form__field">
          <span>Topic</span>
          <select name="topic" value={fields.topic} required onChange={set('topic')}>
            <option value="" disabled>Select a topic…</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="lr-contact-form__field lr-contact-form__field--full">
        <span>Message</span>
        <textarea
          name="message"
          value={fields.message}
          required
          rows={5}
          placeholder="Tell us what you're working on and how we can help…"
          onChange={set('message')}
        />
      </label>

      <button type="submit" className="lr-button lr-button--primary lr-contact-form__submit">
        <span>Send message</span>
        <ArrowTipIcon width={16} height={16} />
      </button>
    </form>
  );
}

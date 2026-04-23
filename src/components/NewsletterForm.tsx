import React, {startTransition, useState} from 'react';
import {ArrowTipIcon} from '@site/src/components/icons';
import {useSiteData} from '@site/src/components/site';

type NewsletterFormProps = {
  compact?: boolean;
  onSuccess?: () => void;
};

export default function NewsletterForm({
  compact = false,
  onSuccess,
}: NewsletterFormProps) {
  const {newsletter} = useSiteData();
  const [email, setEmail] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  function handleSubmit() {
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
      onSuccess?.();
      // clear the email field after submission
      startTransition(() => setEmail(''));
    }, 5000);
  }

  return (
    <>
      {showThankYou ? (
        <div className="mcpExitThanks">
          <h3>Thank you for subscribing!</h3>
          <p>We'll keep you updated on the latest news and insights.</p>
        </div>
      ) : (
        <form
          method="GET"
          action={newsletter.subscribeUrl}
          target="_blank"
          className="lr-newsletter-form"
          onSubmit={handleSubmit}>
          <label className="lr-newsletter-field">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              name={newsletter.emailParam}
              value={email}
              required
              placeholder="you@workshop.dev"
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <button type="submit" className="lr-button lr-button--primary">
            <span>{compact ? 'Subscribe' : 'Join the newsletter'}</span>
            <ArrowTipIcon width={16} height={16} />
          </button>
        </form>
      )}
    </>
  );
}

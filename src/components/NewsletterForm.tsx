import Link from '@docusaurus/Link';
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
  const {newsletter, social} = useSiteData();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = new URL(newsletter.subscribeUrl, window.location.origin);
    if (email.trim()) {
      target.searchParams.set(newsletter.emailParam, email.trim());
    }

    window.open(target.toString(), '_blank', 'noopener,noreferrer');

    startTransition(() => {
      setSubmitted(true);
      setEmail('');
    });

    onSuccess?.();
  }

  return (
    <form className="lr-newsletter-form" onSubmit={handleSubmit}>
      <label className="lr-newsletter-field">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          name="email"
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
      {submitted && !compact ? (
        <p className="lr-newsletter-note">
          The subscription flow opened in a new tab. Prefer RSS instead?{' '}
          <Link href={social.rss}>Follow the feed</Link>.
        </p>
      ) : null}
    </form>
  );
}

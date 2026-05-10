import React, {useEffect, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import NewsletterForm from '@site/src/components/NewsletterForm';
import {CloseIcon} from '@site/src/components/icons';
import {useSiteData} from '@site/src/components/site';

const STORAGE_KEY = 'lr-exit-intent-dismissed-at';

type ExitIntentModalProps = {
  // Overrides the "Before you go" eyebrow when the modal is opened explicitly
  headline?: string;
  // Controlled mode: caller manages visibility; exit-intent logic is skipped
  open?: boolean;
  onClose?: () => void;
};

export default function ExitIntentModal({
  headline,
  open: controlledOpen,
  onClose,
}: ExitIntentModalProps = {}) {
  const {newsletter} = useSiteData();
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const cooldownMs = useMemo(
    () => newsletter.cooldownDays * 24 * 60 * 60 * 1000,
    [newsletter.cooldownDays],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Exit-intent trigger only runs in uncontrolled mode
    if (isControlled || typeof window === 'undefined' || window.innerWidth < 960) {
      return undefined;
    }

    const previousDismissedAt = Number.parseInt(
      window.localStorage.getItem(STORAGE_KEY) ?? '0',
      10,
    );

    if (Number.isFinite(previousDismissedAt) && Date.now() - previousDismissedAt < cooldownMs) {
      return undefined;
    }

    let hasTriggered = false;
    const handler = (event: MouseEvent) => {
      if (hasTriggered || event.clientY > 0) {
        return;
      }

      hasTriggered = true;
      setInternalOpen(true);
    };

    document.addEventListener('mouseout', handler);
    return () => document.removeEventListener('mouseout', handler);
  }, [cooldownMs, isControlled]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
      }
    };

    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [isOpen]);

  function dismiss() {
    if (isControlled) {
      onClose?.();
    } else {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
      }
      setInternalOpen(false);
    }
  }

  if (!mounted || !isOpen) {
    return null;
  }

  return createPortal(
    <div className="lr-modal-backdrop" role="presentation" onClick={dismiss}>
      <div
        className="lr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lr-exit-title"
        onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="lr-modal__close"
          aria-label="Close newsletter popup"
          onClick={dismiss}>
          <CloseIcon width={18} height={18} />
        </button>
        <span className="lr-eyebrow">{headline ?? 'Before you go'}</span>
        <h2 id="lr-exit-title">{newsletter.title}</h2>
        <p>{newsletter.description}</p>
        <NewsletterForm onSuccess={dismiss} />
      </div>
    </div>,
    document.body,
  );
}

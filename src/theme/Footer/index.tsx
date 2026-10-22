import Link from '@docusaurus/Link';
import {useSiteData} from '@site/src/components/site';

export default function Footer() {
  const {brand, social, legal} = useSiteData();

  return (
    <footer className="lr-footer">
      <div className="lr-site-shell lr-footer__inner">
        <div className="lr-footer__brand">
          <img src="/img/brand/logo-wordmark.svg" alt="La Rebelion Labs" />
          <p>{brand.phrase}</p>
          <Link className="lr-footer__signal" to="/labs">
            <span className="lr-status-dot" aria-hidden="true" />
            The lab is active
          </Link>
        </div>
        <div className="lr-footer__links">
          <div>
            <span className="lr-eyebrow">Legal</span>
            <Link to={legal.privacyAtAGlanceUrl}>Privacy at a Glance</Link>
            <Link to={legal.privacyUrl}>Privacy Policy</Link>
            <Link to={legal.termsUrl}>Terms of Service</Link>
          </div>
          <div>
            <span className="lr-eyebrow">Browse</span>
            <Link to="/">Latest</Link>
            <Link to="/archive">Archive</Link>
            <Link to="/tags">Topics</Link>
            <Link to="/subscribe">Newsletter</Link>
            <Link to="/sponsor">Sponsor</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <span className="lr-eyebrow">Follow</span>
            <Link href={social.github}>GitHub</Link>
            <Link href={social.linkedin}>LinkedIn</Link>
            <Link href={social.x}>X</Link>
            <Link href={social.youtube}>YouTube</Link>
            <Link href={social.rss}>RSS</Link>
          </div>
        </div>
      </div>
      <div className="lr-site-shell lr-footer__bottom">
        <span>Independent by design.</span>
        <span>Built in public. Released with intent.</span>
        <span>© {new Date().getFullYear()} La Rebelion Labs</span>
      </div>
    </footer>
  );
}

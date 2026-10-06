import siteData from '../data/site';
import { consent, useConsent } from '../hooks/useConsent';
import { ArrowIcon } from './Icons';

// Google Maps loads only after the visitor allows it (it can set third-party cookies).
export function MapEmbed() {
  const { choice } = useConsent();
  const { contact } = siteData;
  const directionsUrl = `https://www.google.com/maps?q=${contact.factoryCoords.lat},${contact.factoryCoords.lng}`;

  return (
    <div className="relative w-full aspect-[4/3] rounded-[2px] overflow-hidden border border-line bg-bg-raised">
      {choice?.maps ? (
        <iframe
          title="Invent Fine Art studio location"
          src={contact.googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'grayscale(90%) invert(92%) contrast(85%)' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-end gap-4 p-5 md:p-6">
          <div>
            <span className="font-body text-xs font-semibold uppercase tracking-[0.14em] text-accent-2 block mb-2">Studio map</span>
            <p className="font-body text-sm text-text-dim max-w-[340px]">
              The map is provided by Google Maps and may set cookies, so it is switched off until you allow it.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => consent.save(true)}
              className="inline-flex items-center justify-center px-6 rounded-full bg-accent hover:bg-accent-hover text-text text-xs font-semibold uppercase tracking-wider transition-colors min-h-[44px] cursor-pointer"
            >
              Load map
            </button>
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm text-text hover:text-accent-2 transition-colors min-h-[44px]"
            >
              Open in Google Maps <ArrowIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default MapEmbed;

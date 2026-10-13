import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { landingImages, type LandingImageKey } from '../../data/images';
import { Flourish } from './Icons';

interface ImageSlotProps {
  image: LandingImageKey;
  /** Classi per dimensioni/aspect ratio del contenitore (es. "aspect-[4/5]"). */
  className?: string;
  /** Attributo sizes per il browser (immagini responsive). */
  sizes?: string;
  /** Immagine above the fold: caricamento immediato e prioritario (LCP). */
  priority?: boolean;
  /** Segnaposto in tono scuro, per sezioni scure. */
  tone?: 'light' | 'dark';
  /** Reveal con maschera all'ingresso nel viewport. */
  reveal?: boolean;
  /** Zoom leggerissimo all'hover. */
  hover?: boolean;
  /** Indice per lo stagger delle animazioni. */
  index?: number;
  /** Classe extra per il contenitore interno (usata dall'animazione hero). */
  innerClassName?: string;
  as?: 'figure' | 'div';
}

type LoadState = 'loading' | 'loaded' | 'missing';

/**
 * Immagine con segnaposto automatico.
 * Se il file indicato in data/images.ts non esiste (o non è ancora caricato),
 * mostra un segnaposto curato con l'etichetta descrittiva, senza errori a schermo.
 */
export function ImageSlot({
  image,
  className = '',
  sizes = '100vw',
  priority = false,
  tone = 'light',
  reveal = true,
  hover = false,
  index = 0,
  innerClassName = '',
  as: Tag = 'figure',
}: ImageSlotProps) {
  const config = landingImages[image];
  const imgRef = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<LoadState>('loading');

  // Immagini già in cache possono completare prima dell'aggancio degli handler.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? 'loaded' : 'missing');
  }, []);

  const style = {
    '--i': index,
    '--focal': config.focal,
    '--focal-m': 'focalMobile' in config ? config.focalMobile : undefined,
  } as CSSProperties;

  return (
    <Tag
      className={`media ${hover ? 'media--hover' : ''} ${className}`}
      style={style}
      {...(reveal ? { 'data-reveal-media': '' } : {})}
    >
      <div className={`media__inner absolute inset-0 ${innerClassName}`}>
        {state !== 'loaded' && (
          <div
            className={`placeholder ${tone === 'dark' ? 'placeholder--dark' : ''}`}
            role="img"
            aria-label={config.alt}
          >
            <span className="placeholder__frame" />
            <span className="placeholder__label">{config.label}</span>
            <Flourish className="placeholder__mark" />
            <span className="placeholder__meta">Segnaposto · {config.ratio}</span>
          </div>
        )}
        {state !== 'missing' && (
          <img
            ref={imgRef}
            className={`media__img ${state === 'loaded' ? 'is-loaded' : ''}`}
            src={config.src}
            srcSet={'srcSet' in config ? (config.srcSet as string) : undefined}
            sizes={sizes}
            alt={config.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setState('loaded')}
            onError={() => setState('missing')}
          />
        )}
      </div>
    </Tag>
  );
}

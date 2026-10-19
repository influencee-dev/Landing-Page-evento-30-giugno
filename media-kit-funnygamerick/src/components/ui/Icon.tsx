import {
  Gamepad2,
  Laugh,
  Layers,
  MapPin,
  MonitorPlay,
  Network,
  Package,
  ScanSearch,
  Smartphone,
  Sparkles,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { CollaborationFormat, ContentPillar } from '../../data/types';

const MAP: Record<ContentPillar['icon'] | CollaborationFormat['icon'], LucideIcon> = {
  gamepad: Gamepad2,
  zap: Zap,
  laugh: Laugh,
  sparkles: Sparkles,
  smartphone: Smartphone,
  layers: Layers,
  'monitor-play': MonitorPlay,
  package: Package,
  'scan-search': ScanSearch,
  network: Network,
  'map-pin': MapPin,
};

export function Icon({ name, className }: { name: keyof typeof MAP; className?: string }) {
  const C = MAP[name];
  return <C className={className} strokeWidth={1.6} aria-hidden="true" />;
}

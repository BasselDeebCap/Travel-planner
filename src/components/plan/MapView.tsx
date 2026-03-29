import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { MapStop } from '../../types/plan';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  mapId: string;
  title: string;
  subtitle: string;
  stops: MapStop[];
  lineColor: string;
}

export default function MapView({ mapId, title, subtitle, stops, lineColor }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 13,
    }).addTo(map);

    const pts: [number, number][] = stops.map(s => [s.lat, s.lng]);

    stops.forEach((s, i) => {
      const icon = L.divIcon({
        html: `<div style="background:${s.color};color:#fff;font-size:10px;font-weight:700;padding:3px 7px;border-radius:12px;white-space:nowrap;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.4)">${i + 1}. ${s.name}</div>`,
        className: '',
        iconAnchor: [0, 10],
      });

      L.marker([s.lat, s.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${s.name}</strong><br><em>${s.days}</em><br>${s.desc}`);
    });

    L.polyline(pts, { color: lineColor, weight: 2, dashArray: '6,6', opacity: 0.6 }).addTo(map);
    map.fitBounds(pts, { padding: [30, 30] });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [stops, lineColor]);

  return (
    <div className="map-container">
      <div className="map-header">
        {title} <small>{subtitle}</small>
      </div>
      <div ref={containerRef} id={mapId} style={{ width: '100%', height: '360px' }} />
      <div className="map-legend">
        {stops.map((s, i) => (
          <div key={i} className="stop">
            <div className="dot" style={{ background: s.color }} />
            {s.name} ({s.days})
          </div>
        ))}
      </div>
    </div>
  );
}

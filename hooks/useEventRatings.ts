import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AggregatedRatings, EnergyArc } from '../types';

type RawRow = {
  overall: number;
  energy_arc: string;
  selection_style: number;
  mix_quality: number;
  crowd_sync: number;
  tags: string[] | null;
  was_present: boolean;
  age_group: string | null;
};

function aggregate(rows: RawRow[]): AggregatedRatings {
  const count = rows.length;

  const avgOverall = rows.reduce((s, r) => s + r.overall, 0) / count;

  const energyArcDist: Record<EnergyArc, number> = {
    flat: 0,
    building: 0,
    peak: 0,
    rollercoaster: 0,
    afterburner: 0,
  };
  rows.forEach((r) => {
    const arc = r.energy_arc as EnergyArc;
    if (arc in energyArcDist) energyArcDist[arc]++;
  });

  const avgSelectionStyle = rows.reduce((s, r) => s + r.selection_style, 0) / count;
  const avgMixQuality = rows.reduce((s, r) => s + r.mix_quality, 0) / count;
  const avgCrowdSync = rows.reduce((s, r) => s + r.crowd_sync, 0) / count;

  const presentCount = rows.filter((r) => r.was_present).length;
  const presentPct = Math.round((presentCount / count) * 100);

  const wouldReturnCount = rows.filter((r) => r.overall >= 4).length;
  const wouldReturnPct = Math.round((wouldReturnCount / count) * 100);

  const tagCounts: Record<string, number> = {};
  rows.forEach((r) => {
    (r.tags ?? []).forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] ?? 0) + 1;
    });
  });

  const ageGroupDist: Record<string, number> = {};
  rows.forEach((r) => {
    if (r.age_group) {
      ageGroupDist[r.age_group] = (ageGroupDist[r.age_group] ?? 0) + 1;
    }
  });

  // consensusScore: 100 = full agreement, 0 = max polarisation
  // stddev on 1-5 scale: max theoretical stddev ≈ 2
  const mean = avgOverall;
  const variance = rows.reduce((s, r) => s + Math.pow(r.overall - mean, 2), 0) / count;
  const stddev = Math.sqrt(variance);
  const consensusScore = Math.round(Math.max(0, 100 - (stddev / 2) * 100));

  return {
    count,
    avgOverall,
    energyArcDist,
    avgSelectionStyle,
    avgMixQuality,
    avgCrowdSync,
    wouldReturnPct,
    tagCounts,
    presentPct,
    consensusScore,
    ageGroupDist,
  };
}

export function useEventRatings(eventId: string): {
  data: AggregatedRatings | null;
  loading: boolean;
} {
  const [data, setData] = useState<AggregatedRatings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase
      .from('ratings')
      .select('overall,energy_arc,selection_style,mix_quality,crowd_sync,tags,was_present,age_group')
      .eq('event_id', eventId)
      .then(({ data: rows, error }) => {
        if (!mounted) return;
        if (error || !rows || rows.length === 0) {
          setData(null);
        } else {
          setData(aggregate(rows as RawRow[]));
        }
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [eventId]);

  return { data, loading };
}

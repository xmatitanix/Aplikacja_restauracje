import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../constants/theme';
import { ENERGY_ARCS } from '../data/events';
import { AggregatedRatings, EnergyArc } from '../types';

interface Props {
  data: AggregatedRatings;
}

export function RatingDisplay({ data }: Props) {
  const topTags = Object.entries(data.tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const dominantArc = getDominantArc(data.energyArcDist);
  const arcInfo = ENERGY_ARCS.find((a) => a.id === dominantArc);

  return (
    <View style={styles.container}>
      {/* Overall */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>// OVERALL</Text>
        <View style={styles.overallRow}>
          <View style={styles.bigScore}>
            <Text style={styles.bigScoreNum}>
              {data.avgOverall.toFixed(1)}
            </Text>
            <Text style={styles.bigScoreOf}>/5</Text>
          </View>
          <View style={styles.overallMeta}>
            <MetaRow label="RATINGS" value={data.count.toString()} />
            <MetaRow label="POWRÓT" value={`${data.wouldReturnPct}%`} />
            <MetaRow label="OBECNI" value={`${data.presentPct}%`} />
          </View>
        </View>
      </View>

      {/* Consensus */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionLabel}>// CONSENSUS</Text>
          <Text style={styles.consensusScore}>{data.consensusScore}%</Text>
        </View>
        <View style={styles.barTrack}>
          <View
            style={[styles.barFill, { width: `${data.consensusScore}%` }]}
          />
        </View>
        <Text style={styles.consensusHint}>
          {data.consensusScore >= 90
            ? 'Wysoka zgodność — ten set to pewniak'
            : data.consensusScore >= 75
            ? 'Umiarkowana zgodność oceniających'
            : 'Polaryzujący set — opinie podzielone'}
        </Text>
      </View>

      {/* Energy Arc */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>// ENERGY ARC</Text>
        {ENERGY_ARCS.map((arc) => {
          const count = data.energyArcDist[arc.id] ?? 0;
          const total = Object.values(data.energyArcDist).reduce(
            (s, v) => s + v,
            0
          );
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const dominant = arc.id === dominantArc;

          return (
            <View
              key={arc.id}
              style={[styles.arcRow, dominant && styles.arcRowDominant]}
            >
              <Text style={styles.arcShape}>{arc.shape}</Text>
              <Text style={[styles.arcLabel, dominant && styles.arcLabelDominant]}>
                {arc.label}
              </Text>
              <View style={styles.arcBarTrack}>
                <View style={[styles.arcBarFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.arcPct}>{pct}%</Text>
            </View>
          );
        })}
        {arcInfo && (
          <Text style={styles.arcNote}>{arcInfo.desc}</Text>
        )}
      </View>

      {/* Mix & Crowd */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>// TECHNIKALIA</Text>
        <ScoreRow
          label="MIX QUALITY"
          score={data.avgMixQuality}
          low="rough"
          high="seamless"
        />
        <ScoreRow
          label="CROWD SYNC"
          score={data.avgCrowdSync}
          low="miss"
          high="perfect"
        />
        <ScoreRow
          label="SELECTION"
          score={normalizeSelection(data.avgSelectionStyle)}
          low="safe"
          high="experimental"
        />
      </View>

      {/* Vibe Tags */}
      {topTags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>// VIBE TAGS</Text>
          <View style={styles.tagsGrid}>
            {topTags.map(([tag, count]) => {
              const pct = Math.round((count / data.count) * 100);
              return (
                <View key={tag} style={styles.tagItem}>
                  <View style={styles.tagHeader}>
                    <Text style={styles.tagName}>{tag}</Text>
                    <Text style={styles.tagPct}>{pct}%</Text>
                  </View>
                  <View style={styles.tagTrack}>
                    <View style={[styles.tagFill, { width: `${pct}%` }]} />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

function ScoreRow({
  label,
  score,
  low,
  high,
}: {
  label: string;
  score: number;
  low: string;
  high: string;
}) {
  const pct = ((score - 1) / 4) * 100;
  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreRowLabel}>{label}</Text>
      <View style={styles.scoreRowBody}>
        <Text style={styles.spectrumLabel}>{low}</Text>
        <View style={styles.scoreBarTrack}>
          <View style={[styles.scoreBarFill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.spectrumLabel}>{high}</Text>
        <Text style={styles.scoreRowNum}>{score.toFixed(1)}</Text>
      </View>
    </View>
  );
}

function getDominantArc(dist: Record<EnergyArc, number>): EnergyArc {
  return (Object.entries(dist).sort(([, a], [, b]) => b - a)[0][0] as EnergyArc);
}

function normalizeSelection(avg: number): number {
  // converts -2..+2 range to 1..5 range
  return ((avg + 2) / 4) * 4 + 1;
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  section: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.md,
  },

  // Overall
  overallRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.xl,
  },
  bigScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bigScoreNum: {
    fontSize: 52,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    lineHeight: 56,
  },
  bigScoreOf: {
    fontSize: theme.font.sizes.xl,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.medium,
    marginBottom: 8,
  },
  overallMeta: {
    flex: 1,
    gap: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaLabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    letterSpacing: theme.font.letterSpacing.wider,
    fontWeight: theme.font.weights.semibold,
  },
  metaValue: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.text,
    fontWeight: theme.font.weights.bold,
    fontVariant: ['tabular-nums'],
  },

  // Consensus
  consensusScore: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
  },
  barTrack: {
    height: 3,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.colors.text,
  },
  consensusHint: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
  },

  // Arc
  arcRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    paddingVertical: 4,
  },
  arcRowDominant: {
    backgroundColor: theme.colors.accentLight,
    marginHorizontal: -theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: theme.colors.text,
  },
  arcShape: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textTertiary,
    width: 40,
    fontFamily: 'monospace',
  },
  arcLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wide,
    color: theme.colors.textSecondary,
    width: 100,
    fontWeight: theme.font.weights.medium,
  },
  arcLabelDominant: {
    color: theme.colors.text,
    fontWeight: theme.font.weights.bold,
  },
  arcBarTrack: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
  },
  arcBarFill: {
    height: '100%',
    backgroundColor: theme.colors.text,
  },
  arcPct: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
    width: 30,
    textAlign: 'right',
  },
  arcNote: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    marginTop: theme.spacing.sm,
  },

  // Score rows
  scoreRow: {
    marginBottom: theme.spacing.md,
  },
  scoreRowLabel: {
    fontSize: theme.font.sizes.xs,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginBottom: 6,
  },
  scoreRowBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  spectrumLabel: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    width: 56,
  },
  scoreBarTrack: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border,
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: theme.colors.text,
  },
  scoreRowNum: {
    fontSize: theme.font.sizes.sm,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    fontVariant: ['tabular-nums'],
    width: 24,
    textAlign: 'right',
  },

  // Tags
  tagsGrid: {
    gap: theme.spacing.sm,
  },
  tagItem: {},
  tagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  tagName: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.text,
    fontWeight: theme.font.weights.medium,
  },
  tagPct: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  tagTrack: {
    height: 2,
    backgroundColor: theme.colors.border,
  },
  tagFill: {
    height: '100%',
    backgroundColor: theme.colors.textSecondary,
  },
});

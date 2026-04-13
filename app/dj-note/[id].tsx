import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import { getEventById } from '../../data/events';
import { useDjNotes } from '../../hooks/useDjNotes';
import { isValidEventId } from '../../types';

const MAX_CHARS = 280;

export default function DjNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const event = isValidEventId(id) ? getEventById(id) : null;
  const { myNote, saveNote, deleteNote } = useDjNotes(isValidEventId(id) ? id : '');

  const isEditing = !!myNote;
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (myNote) {
      setAuthorName(myNote.author_name);
      setContent(myNote.content);
    }
  }, [myNote]);

  if (!user || !event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {!user ? 'MUSISZ BYĆ ZALOGOWANY' : 'SET NOT FOUND'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const charsLeft = MAX_CHARS - content.length;
  const canSave =
    authorName.trim().length > 0 &&
    content.trim().length > 0 &&
    charsLeft >= 0;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const { error } = await saveNote(authorName, content);
    setSaving(false);
    if (error) {
      Alert.alert('Błąd', 'Nie udało się zapisać notatki. Spróbuj ponownie.');
    } else {
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert('Usuń notatkę', 'Na pewno?', [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: async () => {
          await deleteNote();
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        {/* Event context */}
        <View style={styles.banner}>
          <View style={styles.bannerText}>
            <Text style={styles.bannerDj} numberOfLines={1}>{event.djName}</Text>
            <Text style={styles.bannerVenue}>{event.venueName} · {event.date}</Text>
          </View>
          {isEditing && (
            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [styles.deleteLink, pressed && styles.pressed]}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Text style={styles.deleteLinkText}>USUŃ</Text>
            </Pressable>
          )}
        </View>

        {/* Author — only editable on first note, readonly chip after */}
        {isEditing ? (
          <View style={styles.authorChip}>
            <Text style={styles.authorChipLabel}>PISZESZ JAKO</Text>
            <Text style={styles.authorChipName}>{myNote!.author_name}</Text>
          </View>
        ) : (
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>NAZWA ARTYSTYCZNA *</Text>
            <TextInput
              style={styles.input}
              value={authorName}
              onChangeText={setAuthorName}
              placeholder="Twoja nazwa DJ / artysta"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="words"
              maxLength={60}
              returnKeyType="next"
              autoFocus
            />
          </View>
        )}

        {/* Note content — takes the rest of the space */}
        <View style={styles.contentArea}>
          <TextInput
            style={styles.contentInput}
            value={content}
            onChangeText={setContent}
            placeholder="Napisz kilka słów dla fanów..."
            placeholderTextColor={theme.colors.textTertiary}
            multiline
            maxLength={MAX_CHARS}
            textAlignVertical="top"
            autoFocus={isEditing}
          />
          <Text style={[styles.charCount, charsLeft < 20 && styles.charCountWarn]}>
            {charsLeft}
          </Text>
        </View>

        {/* Save */}
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              (!canSave || saving) && styles.saveBtnDisabled,
              pressed && canSave && styles.pressed,
            ]}
            onPress={handleSave}
            disabled={!canSave || saving}
          >
            <Text style={[styles.saveBtnText, (!canSave || saving) && styles.saveBtnTextDisabled]}>
              {saving ? '...' : isEditing ? 'ZAKTUALIZUJ' : 'OPUBLIKUJ'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  pressed: { opacity: 0.7 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
  },

  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.md,
  },
  bannerText: { flex: 1, minWidth: 0 },
  bannerDj: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    color: theme.colors.text,
  },
  bannerVenue: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 2,
  },
  deleteLink: {
    paddingHorizontal: theme.spacing.xs,
  },
  deleteLinkText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.danger,
  },

  authorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  authorChipLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  authorChipName: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    color: theme.colors.text,
    letterSpacing: theme.font.letterSpacing.wide,
  },

  field: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  fieldLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    fontSize: theme.font.sizes.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 44,
  },

  contentArea: {
    flex: 1,
    padding: theme.spacing.md,
    position: 'relative',
  },
  contentInput: {
    flex: 1,
    fontSize: theme.font.sizes.md,
    color: theme.colors.text,
    lineHeight: 22,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: theme.spacing.sm,
    right: theme.spacing.md,
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontVariant: ['tabular-nums'],
  },
  charCountWarn: { color: theme.colors.danger },

  footer: {
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveBtn: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveBtnText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.white,
  },
  saveBtnTextDisabled: { color: theme.colors.textTertiary },
});

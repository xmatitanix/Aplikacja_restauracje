import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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

const MAX_CONTENT = 280;
const MAX_AUTHOR = 60;

export default function DjNoteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const validId = isValidEventId(id) ? id : null;
  const event = validId ? getEventById(validId) : null;
  const { myNote, saveNote, deleteNote } = useDjNotes(validId ?? '');

  // Pre-fill if editing existing note
  useEffect(() => {
    if (myNote) {
      setAuthorName(myNote.author_name);
      setContent(myNote.content);
    }
  }, [myNote]);

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>MUSISZ BYĆ ZALOGOWANY</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>SET NOT FOUND</Text>
        </View>
      </SafeAreaView>
    );
  }

  const canSave =
    authorName.trim().length > 0 &&
    content.trim().length > 0 &&
    content.trim().length <= MAX_CONTENT;

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
    Alert.alert(
      'Usuń notatkę',
      'Na pewno chcesz usunąć tę notatkę?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            await deleteNote();
            router.back();
          },
        },
      ]
    );
  };

  const charsLeft = MAX_CONTENT - content.length;
  const isOver = charsLeft < 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          style={styles.scroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Event info */}
          <View style={styles.eventBanner}>
            <Text style={styles.eventBannerLabel}>// NOTATKA DO SETU</Text>
            <Text style={styles.eventBannerName} numberOfLines={2}>
              {event.djName}
            </Text>
            <Text style={styles.eventBannerVenue}>
              {event.venueName} · {event.date}
            </Text>
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              Jako DJ możesz zostawić krótką notatkę dla fanów — wrażenia po secie,
              podziękowania, anegdoty. Widoczne dla wszystkich użytkowników.
            </Text>
          </View>

          {/* Author name */}
          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>NAZWA ARTYSTYCZNA</Text>
              <Text style={styles.fieldRequired}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              value={authorName}
              onChangeText={setAuthorName}
              placeholder="Twoja nazwa DJ / artysta"
              placeholderTextColor={theme.colors.textTertiary}
              autoCapitalize="words"
              maxLength={MAX_AUTHOR}
              returnKeyType="next"
            />
          </View>

          {/* Note content */}
          <View style={styles.field}>
            <View style={styles.fieldLabelRow}>
              <Text style={styles.fieldLabel}>NOTATKA</Text>
              <Text style={styles.fieldRequired}>*</Text>
              <Text style={[styles.charCount, isOver && styles.charCountOver]}>
                {' '}— {charsLeft} znaków
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.inputMultiline, isOver && styles.inputOver]}
              value={content}
              onChangeText={setContent}
              placeholder="Napisz kilka słów do fanów... Jak się czułeś/aś? Co dziś grałeś/aś? Ciekawe story z backstage?"
              placeholderTextColor={theme.colors.textTertiary}
              multiline
              numberOfLines={5}
              maxLength={MAX_CONTENT + 20}
              textAlignVertical="top"
            />
          </View>

          {/* Save */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                (!canSave || saving) && styles.saveBtnDisabled,
                pressed && canSave && styles.pressed,
              ]}
              onPress={handleSave}
              disabled={!canSave || saving}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.saveBtnText,
                  (!canSave || saving) && styles.saveBtnTextDisabled,
                ]}
              >
                {saving ? 'ZAPISYWANIE...' : myNote ? 'ZAKTUALIZUJ' : 'OPUBLIKUJ NOTATKĘ'}
              </Text>
            </Pressable>

            {myNote && (
              <Pressable
                style={({ pressed }) => [
                  styles.deleteBtn,
                  pressed && styles.pressed,
                ]}
                onPress={handleDelete}
                accessibilityRole="button"
              >
                <Text style={styles.deleteBtnText}>USUŃ NOTATKĘ</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.xxxl },
  pressed: { opacity: 0.7 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: {
    fontSize: theme.font.sizes.md,
    fontWeight: theme.font.weights.black,
    letterSpacing: theme.font.letterSpacing.widest,
    color: theme.colors.textTertiary,
  },

  eventBanner: {
    padding: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.borderStrong,
    backgroundColor: theme.colors.surface,
  },
  eventBannerLabel: {
    fontSize: 10,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
    fontWeight: theme.font.weights.semibold,
    marginBottom: theme.spacing.xs,
  },
  eventBannerName: {
    fontSize: theme.font.sizes.xl,
    fontWeight: theme.font.weights.black,
    letterSpacing: -0.5,
    color: theme.colors.text,
    lineHeight: 28,
  },
  eventBannerVenue: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    marginTop: 4,
    letterSpacing: theme.font.letterSpacing.wide,
  },

  hint: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  hintText: {
    fontSize: theme.font.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },

  field: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.semibold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: theme.colors.textTertiary,
  },
  fieldRequired: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.text,
    fontWeight: theme.font.weights.black,
    marginLeft: 3,
  },
  charCount: {
    fontSize: theme.font.sizes.xs,
    color: theme.colors.textTertiary,
    fontStyle: 'italic',
    marginLeft: 2,
  },
  charCountOver: { color: '#E53E3E' },

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
  inputMultiline: {
    minHeight: 120,
    paddingTop: theme.spacing.sm,
    lineHeight: 22,
  },
  inputOver: {
    borderColor: '#E53E3E',
  },

  actions: {
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  saveBtn: {
    backgroundColor: theme.colors.text,
    padding: theme.spacing.lg,
    alignItems: 'center',
    minHeight: 56,
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
  saveBtnTextDisabled: {
    color: theme.colors.textTertiary,
  },
  deleteBtn: {
    borderWidth: 1,
    borderColor: '#E53E3E',
    padding: theme.spacing.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontSize: theme.font.sizes.xs,
    fontWeight: theme.font.weights.bold,
    letterSpacing: theme.font.letterSpacing.wider,
    color: '#E53E3E',
  },
});

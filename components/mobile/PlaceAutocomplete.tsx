import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { PlaceRow } from '@/components/mobile/PlaceRow';
import { SearchField } from '@/components/mobile/SearchField';
import { colors, spacing, typography } from '@/src/constants/theme';
import { searchPlaces, type PlaceSuggestion } from '@/src/services/placeService';

/** Wait this long after the last keystroke before searching (Nominatim allows ~1 request/second). */
const DEBOUNCE_MS = 600;
const MIN_QUERY_LENGTH = 3;

type PlaceAutocompleteProps = {
  kind: 'origen' | 'destino';
  value: string;
  placeholder: string;
  /** Called on every keystroke; the typed text no longer matches a picked place. */
  onChangeText: (text: string) => void;
  /** Called when the user picks a suggestion. */
  onSelect: (place: PlaceSuggestion) => void;
  inputProps?: Omit<TextInputProps, 'value' | 'onChangeText' | 'placeholder'>;
  style?: StyleProp<ViewStyle>;
};

/**
 * Origen/Destino field that suggests places in Costa Rica while typing
 * (OpenStreetMap search). Suggestions show below the field only while it is focused.
 */
export function PlaceAutocomplete({
  kind,
  value,
  placeholder,
  onChangeText,
  onSelect,
  inputProps,
  style,
}: PlaceAutocompleteProps) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // the text that came from picking a suggestion: it should not trigger a new search
  const pickedText = useRef<string | null>(null);

  useEffect(() => {
    const query = value.trim();
    if (!focused || query.length < MIN_QUERY_LENGTH || query === pickedText.current) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        setSuggestions(await searchPlaces(query, controller.signal));
      } catch (cause) {
        // an aborted request just means the user kept typing
        if (!controller.signal.aborted) {
          setSuggestions([]);
          setError(cause instanceof Error ? cause.message : 'No se pudieron buscar lugares.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, focused]);

  const pick = (place: PlaceSuggestion) => {
    pickedText.current = place.name;
    setSuggestions([]);
    onSelect(place);
  };

  const showList = focused && (loading || error !== null || suggestions.length > 0);

  return (
    <View style={style}>
      <SearchField
        kind={kind}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        inputProps={{
          ...inputProps,
          onFocus: (event) => {
            setFocused(true);
            inputProps?.onFocus?.(event);
          },
          onBlur: (event) => {
            setFocused(false);
            inputProps?.onBlur?.(event);
          },
        }}
      />
      {showList ? (
        <View style={styles.list}>
          {loading ? <ActivityIndicator color={colors.primary} style={styles.loading} /> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {suggestions.map((place, index) => (
            <PlaceRow
              key={`${place.point.lat},${place.point.lng},${index}`}
              name={place.name}
              detail={place.detail}
              onPress={() => pick(place)}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.s,
  },
  loading: {
    paddingVertical: spacing.s,
  },
  error: {
    ...typography.textSmall,
    paddingVertical: spacing.s,
    color: colors.error,
  },
});

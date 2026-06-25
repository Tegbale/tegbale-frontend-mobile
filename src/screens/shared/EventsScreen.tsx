import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../theme/colors';
import { listEvents, SchoolEvent, EventStatus } from '../../services/eventsService';

const STATUS_FILTERS: { label: string; value: EventStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Upcoming', value: 'UPCOMING' },
  { label: 'Ongoing', value: 'ONGOING' },
  { label: 'Completed', value: 'COMPLETED' },
];

const STATUS_COLORS: Record<EventStatus, string> = {
  UPCOMING: '#4A90D9',
  ONGOING: '#27AE60',
  COMPLETED: '#8E8E93',
  CANCELLED: '#E74C3C',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function EventCard({ event }: { event: SchoolEvent }) {
  const statusColor = STATUS_COLORS[event.status] ?? Colors.secondaryText;
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={[styles.dateBox, { backgroundColor: statusColor + '18' }]}>
          <Text style={[styles.dateDay, { color: statusColor }]}>
            {new Date(event.startDate).getDate()}
          </Text>
          <Text style={[styles.dateMonth, { color: statusColor }]}>
            {new Date(event.startDate).toLocaleDateString('en-GB', { month: 'short' })}
          </Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
            <Text style={[styles.statusText, { color: statusColor }]}>
              {event.status.charAt(0) + event.status.slice(1).toLowerCase()}
            </Text>
          </View>
        </View>
        {event.description ? (
          <Text style={styles.eventDesc} numberOfLines={2}>{event.description}</Text>
        ) : null}
        <View style={styles.eventMeta}>
          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={13} color={Colors.secondaryText} />
            <Text style={styles.metaText}>{formatTime(event.startDate)}</Text>
            {event.endDate ? (
              <Text style={styles.metaText}> – {formatDate(event.endDate)}</Text>
            ) : null}
          </View>
          {event.location ? (
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color={Colors.secondaryText} />
              <Text style={styles.metaText}>{event.location}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function EventsScreen() {
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EventStatus | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const res = await listEvents(1, 50, activeFilter);
      setEvents(res.events);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
      </View>

      <View style={styles.filters}>
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.label}
            style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
            onPress={() => setActiveFilter(f.value)}
          >
            <Text style={[styles.filterLabel, activeFilter === f.value && styles.filterLabelActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primaryBlue} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={48} color={Colors.secondaryText} />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => fetchEvents()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="calendar-outline" size={56} color={Colors.borderGray} />
          <Text style={styles.emptyText}>No events found</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EventCard event={item} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primaryBlue} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    backgroundColor: Colors.primaryBlue,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.white },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  filterChipActive: {
    backgroundColor: Colors.primaryBlue,
  },
  filterLabel: { fontSize: 13, color: Colors.secondaryText, fontWeight: '500' },
  filterLabelActive: { color: Colors.white },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    flexDirection: 'row',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLeft: { marginRight: 14 },
  dateBox: {
    width: 48,
    height: 56,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: { fontSize: 22, fontWeight: '800', lineHeight: 26 },
  dateMonth: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  cardBody: { flex: 1 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, gap: 8 },
  eventTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: Colors.darkText },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: { fontSize: 11, fontWeight: '600' },
  eventDesc: { fontSize: 13, color: Colors.secondaryText, marginBottom: 8, lineHeight: 18 },
  eventMeta: { gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: Colors.secondaryText },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontSize: 14, color: Colors.secondaryText, textAlign: 'center' },
  retryBtn: { backgroundColor: Colors.primaryBlue, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryText: { color: Colors.white, fontWeight: '600', fontSize: 14 },
});

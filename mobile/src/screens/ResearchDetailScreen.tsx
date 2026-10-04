import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface ActionItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  description: string;
}

export default function ResearchDetailScreen({ route }: any) {
  const navigation = useNavigation();
  const { queryId, query } = route.params || {};
  const [loading, setLoading] = useState(false);

  const actions: ActionItem[] = [
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      route: 'Search',
      description: 'Semantic search results',
    },
    {
      id: 'patterns',
      label: 'Patterns',
      icon: '📊',
      route: 'Patterns',
      description: 'Detect trends & anomalies',
    },
    {
      id: 'facts',
      label: 'Facts',
      icon: '✓',
      route: 'Facts',
      description: 'Verified facts',
    },
    {
      id: 'alerts',
      label: 'Alerts',
      icon: '🔔',
      route: 'Alerts',
      description: 'New developments',
    },
  ];

  const handleActionPress = (action: ActionItem) => {
    navigation.navigate(action.route, { queryId, query });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.queryHeader}>
          <Text style={styles.queryTitle}>{query}</Text>
        </View>

        <View style={styles.actionsGrid}>
          {actions.map(action => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionCard}
              onPress={() => handleActionPress(action)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionLabel}>{action.label}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Research Stats</Text>
          <View style={styles.statRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>1,234</Text>
              <Text style={styles.statLabel}>Results Found</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>85%</Text>
              <Text style={styles.statLabel}>Quality Score</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  queryHeader: {
    backgroundColor: '#1A1A2E',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  queryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    margin: '1%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A2A3E',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 10,
    color: '#888888',
    textAlign: 'center',
  },
  statsSection: {
    padding: 16,
    backgroundColor: '#1A1A2E',
    margin: 12,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00D4FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
  },
});

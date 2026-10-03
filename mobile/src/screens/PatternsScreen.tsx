import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';

interface Pattern {
  id: string;
  type: 'trend' | 'cluster' | 'anomaly';
  name: string;
  strength: number;
  description: string;
  items: string[];
  confidence: number;
}

interface PatternsData {
  trends: Pattern[];
  clusters: Pattern[];
  anomalies: Pattern[];
}

export default function PatternsScreen({ route }: any) {
  const { queryId } = route.params || {};
  const [patterns, setPatterns] = useState<PatternsData>({
    trends: [],
    clusters: [],
    anomalies: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<'trends' | 'clusters' | 'anomalies'>('trends');

  useEffect(() => {
    fetchPatterns();
  }, [queryId]);

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/research/${queryId}/patterns`
      );
      setPatterns(response.data);
    } catch (error) {
      console.error('Failed to fetch patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatternIcon = (type: string): string => {
    switch (type) {
      case 'trend':
        return '📈';
      case 'cluster':
        return '🔗';
      case 'anomaly':
        return '⚠️';
      default:
        return '•';
    }
  };

  const getColorByType = (type: string): string => {
    switch (type) {
      case 'trend':
        return '#00D966';
      case 'cluster':
        return '#00D4FF';
      case 'anomaly':
        return '#FFB800';
      default:
        return '#666666';
    }
  };

  const renderPatternItem = (pattern: Pattern) => (
    <View key={pattern.id} style={[styles.patternCard, { borderLeftColor: getColorByType(pattern.type) }]}>
      <View style={styles.patternHeader}>
        <Text style={styles.patternIcon}>{getPatternIcon(pattern.type)}</Text>
        <View style={styles.patternTitleContainer}>
          <Text style={styles.patternName}>{pattern.name}</Text>
          <Text style={styles.patternDescription}>{pattern.description}</Text>
        </View>
      </View>

      <View style={styles.patternMetrics}>
        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Strength</Text>
          <View style={styles.strengthBar}>
            <View
              style={[
                styles.strengthFill,
                {
                  width: `${pattern.strength * 100}%`,
                  backgroundColor: getColorByType(pattern.type),
                },
              ]}
            />
          </View>
          <Text style={styles.metricValue}>{(pattern.strength * 100).toFixed(0)}%</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Confidence</Text>
          <Text style={styles.confidenceValue}>{(pattern.confidence * 100).toFixed(0)}%</Text>
        </View>

        <View style={styles.metricItem}>
          <Text style={styles.metricLabel}>Items</Text>
          <Text style={styles.itemsValue}>{pattern.items.length}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00D4FF" />
      </View>
    );
  }

  const selectedPatterns =
    selectedType === 'trends'
      ? patterns.trends
      : selectedType === 'clusters'
      ? patterns.clusters
      : patterns.anomalies;

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedType === 'trends' && styles.activeTab]}
          onPress={() => setSelectedType('trends')}
        >
          <Text style={[styles.tabText, selectedType === 'trends' && styles.activeTabText]}>
            📈 Trends ({patterns.trends.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedType === 'clusters' && styles.activeTab]}
          onPress={() => setSelectedType('clusters')}
        >
          <Text style={[styles.tabText, selectedType === 'clusters' && styles.activeTabText]}>
            🔗 Clusters ({patterns.clusters.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedType === 'anomalies' && styles.activeTab]}
          onPress={() => setSelectedType('anomalies')}
        >
          <Text style={[styles.tabText, selectedType === 'anomalies' && styles.activeTabText]}>
            ⚠️ Anomalies ({patterns.anomalies.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.patternsContainer} contentContainerStyle={styles.patternsContent}>
        {selectedPatterns.length > 0 ? (
          selectedPatterns.map(renderPatternItem)
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No {selectedType} detected</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F1E',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A2E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#00D4FF',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
  },
  activeTabText: {
    color: '#00D4FF',
  },
  patternsContainer: {
    flex: 1,
  },
  patternsContent: {
    padding: 12,
  },
  patternCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  patternHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  patternIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  patternTitleContainer: {
    flex: 1,
  },
  patternName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  patternDescription: {
    fontSize: 12,
    color: '#888888',
  },
  patternMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 4,
  },
  strengthBar: {
    width: 60,
    height: 4,
    backgroundColor: '#2A2A3E',
    borderRadius: 2,
    marginBottom: 4,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00D4FF',
  },
  itemsValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00D966',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
  },
});

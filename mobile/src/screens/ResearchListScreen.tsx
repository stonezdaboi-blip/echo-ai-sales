import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

interface Research {
  id: string;
  query: string;
  status: string;
  created_at: string;
  results_count: number;
}

export default function ResearchListScreen() {
  const navigation = useNavigation();
  const [researches, setResearches] = useState<Research[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResearches();
  }, []);

  const fetchResearches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/api/researches');
      setResearches(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load researches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResearchPress = (research: Research) => {
    navigation.navigate('ResearchDetail', { 
      queryId: research.id,
      query: research.query,
    });
  };

  const renderResearchItem = ({ item }: { item: Research }) => (
    <TouchableOpacity
      style={styles.researchCard}
      onPress={() => handleResearchPress(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.queryText} numberOfLines={2}>
          {item.query}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.metaText}>
          {item.results_count} results
        </Text>
        <Text style={styles.metaText}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#00D4FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Research Projects</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Search')}
        >
          <Text style={styles.addButtonText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {researches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No research projects yet</Text>
          <Text style={styles.emptySubText}>Start a new research to get insights</Text>
        </View>
      ) : (
        <FlatList
          data={researches}
          renderItem={renderResearchItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#00D966';
    case 'processing':
      return '#00D4FF';
    case 'pending':
      return '#FFB800';
    default:
      return '#666666';
  }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1A1A2E',
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#00D4FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: 12,
  },
  researchCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00D4FF',
  },
  cardHeader: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  queryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: '#888888',
  },
  errorContainer: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    margin: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});

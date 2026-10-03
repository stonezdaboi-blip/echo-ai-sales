import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';

interface SearchResultItem {
  id: string;
  content: string;
  similarity: number;
  relevance: number;
  confidence: number;
  source: string;
}

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ quality: 0, responseTime: 0 });

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:3000/api/search',
        { query },
      );

      setResults(response.data.results || []);
      setStats({
        quality: response.data.quality || 0,
        responseTime: response.data.responseTime || 0,
      });
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderResultItem = ({ item }: { item: SearchResultItem }) => (
    <View style={styles.resultCard}>
      <View style={styles.resultHeader}>
        <Text style={styles.sourceTag}>{item.source}</Text>
        <View style={styles.scoresContainer}>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Similarity</Text>
            <Text style={styles.scoreValue}>
              {(item.similarity * 100).toFixed(0)}%
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Relevance</Text>
            <Text style={styles.scoreValue}>
              {(item.relevance * 100).toFixed(0)}%
            </Text>
          </View>
          <View style={styles.scoreItem}>
            <Text style={styles.scoreLabel}>Confidence</Text>
            <Text style={styles.scoreValue}>
              {(item.confidence * 100).toFixed(0)}%
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.resultContent} numberOfLines={3}>
        {item.content}
      </Text>

      <View style={styles.resultFooter}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>View Full</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search prospects, companies, trends..."
            placeholderTextColor="#666666"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <Text style={styles.searchButtonText}>🔍</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {results.length > 0 && (
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Search Quality</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Quality Score</Text>
              <Text style={styles.statValue}>{(stats.quality * 100).toFixed(0)}%</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Response Time</Text>
              <Text style={styles.statValue}>{stats.responseTime}ms</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Results</Text>
              <Text style={styles.statValue}>{results.length}</Text>
            </View>
          </View>
        </View>
      )}

      {results.length > 0 ? (
        <FlatList
          data={results}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.resultsList}
          scrollEnabled={true}
        />
      ) : !loading && query ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  searchSection: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A3E',
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#00D4FF',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
  },
  statsSection: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A3E',
  },
  statsTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D4FF',
  },
  resultsList: {
    padding: 12,
  },
  resultCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#00D4FF',
  },
  resultHeader: {
    marginBottom: 12,
  },
  sourceTag: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00D4FF',
    marginBottom: 8,
  },
  scoresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    color: '#888888',
    marginBottom: 2,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultContent: {
    fontSize: 14,
    color: '#CCCCCC',
    lineHeight: 20,
    marginBottom: 12,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2A2A3E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  actionText: {
    color: '#00D4FF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888888',
  },
});

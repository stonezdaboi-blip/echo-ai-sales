import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';

interface SettingsItem {
  id: string;
  label: string;
  value?: string;
  type: 'toggle' | 'link' | 'info';
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: true,
    autoSync: true,
    analytics: false,
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          id: 'notifications',
          label: 'Push Notifications',
          type: 'toggle' as const,
        },
        {
          id: 'autoSync',
          label: 'Auto Sync Research',
          type: 'toggle' as const,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'analytics',
          label: 'Share Analytics',
          type: 'toggle' as const,
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          type: 'link' as const,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'version',
          label: 'App Version',
          value: '1.0.0',
          type: 'info' as const,
        },
        {
          id: 'build',
          label: 'Build Number',
          value: '2026.10.03',
          type: 'info' as const,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingsItem) => {
    switch (item.type) {
      case 'toggle':
        return (
          <View key={item.id} style={styles.settingRow}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Switch
              value={settings[item.id as keyof typeof settings] as boolean}
              onValueChange={() => handleToggle(item.id as keyof typeof settings)}
              trackColor={{ false: '#2A2A3E', true: '#00D4FF' }}
              thumbColor="#FFFFFF"
            />
          </View>
        );
      case 'link':
        return (
          <TouchableOpacity key={item.id} style={styles.settingRow}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
        );
      case 'info':
        return (
          <View key={item.id} style={styles.settingRow}>
            <Text style={styles.settingLabel}>{item.label}</Text>
            <Text style={styles.settingValue}>{item.value}</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {settingsSections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, index) => (
                <View key={item.id}>
                  {renderSettingItem(item)}
                  {index < section.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
  },
  content: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    paddingHorizontal: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    backgroundColor: '#1A1A2E',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#2A2A3E',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
    color: '#888888',
  },
  linkArrow: {
    fontSize: 18,
    color: '#00D4FF',
  },
  divider: {
    height: 1,
    backgroundColor: '#2A2A3E',
    marginHorizontal: 16,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 32,
    paddingVertical: 14,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

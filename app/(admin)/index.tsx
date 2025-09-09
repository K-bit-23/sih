import React from 'react';
import { View, Text } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export default function AdminPage() {
  const { t } = useLanguage();

  return (
    <View>
      <Text>{t('adminPage')}</Text>
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from "react-native";
import { fetchNews } from "../api/backend";
import NewsCard from "../components/NewsCard";

export default function HomeScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadNews() {
    try {
      const data = await fetchNews();
      setArticles(data);
    } catch (err) {
      console.error("Error fetching news:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading latest news…</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={articles}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NewsCard article={item} />}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadNews} colors={["#007bff"]} />
      }
    />
  );
}


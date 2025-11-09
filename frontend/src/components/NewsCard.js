import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";

export default function NewsCard({ article }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        marginVertical: 8,
        marginHorizontal: 12,
        borderRadius: 12,
        elevation: 3,
        padding: 12,
      }}
    >
      {article.urlToImage && (
        <Image
          source={{ uri: article.urlToImage }}
          style={{ width: "100%", height: 180, borderRadius: 12, marginBottom: 10 }}
        />
      )}

      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 6 }}>{article.title}</Text>
      <Text style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
        {article.summary || article.description}
      </Text>
      <TouchableOpacity
        onPress={() => Linking.openURL(article.url)}
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#007bff",
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "500" }}>Read More</Text>
      </TouchableOpacity>
    </View>
  );
}


import React, { useState, memo } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';


const ProgressiveImage = memo(({
  source,
  thumbnailSource,
  style,
  containerStyle,
  resizeMode = 'cover',
  fallbackSource,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleThumbnailLoad = () => {
    setThumbnailLoaded(true);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Thumbnail (low-res) */}
      {thumbnailSource && !thumbnailLoaded && (
        <Image
          source={thumbnailSource}
          style={[styles.image, style, styles.thumbnail]}
          resizeMode={resizeMode}
          onLoad={handleThumbnailLoad}
          blurRadius={1}
        />
      )}

      {/* Main image */}
      {!error ? (
        <Image
          source={source}
          style={[styles.image, style]}
          resizeMode={resizeMode}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
        />
      ) : fallbackSource ? (
        <Image
          source={fallbackSource}
          style={[styles.image, style]}
          resizeMode={resizeMode}
        />
      ) : (
        <View style={[styles.errorContainer, style]}>
          <View style={styles.errorPlaceholder} />
        </View>
      )}

      {/* Loading indicator */}
      {loading && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#52B788" />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  errorPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
  },
});

ProgressiveImage.displayName = 'ProgressiveImage';

export default ProgressiveImage;

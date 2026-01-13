import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import HeroSection from '../components/HeroSection';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelectorModal from '../components/LanguageSelectorModal';

const API_URL = `${process.env.EXPO_PUBLIC_API_BASE_URL}/products/search`;

const HomeScreen = ({ navigation }: { navigation: any }) => {
    const { language, selectLanguage } = useLanguage(); // Using context
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = async () => {
        try {
            setError(null);
            const response = await axios.get(API_URL);
            // Verify data struct
            const data = Array.isArray(response.data) ? response.data : [];
            setProducts(data);
        } catch (err) {
            console.error('Mobile fetch error:', err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        // Trigger generic modal logic if no language set (handling logic inside useLanguage usually, but explicit here for safety)
        if (!language) {
            setShowLanguageModal(true);
        }
    }, [language]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProducts();
    }, []);

    const handleProductPress = (productId: string) => {
        // Navigate to product details
        navigation.navigate('ProductDetails', { productId: productId });
    };

    if (loading && !refreshing) {
        return (
            <SafeAreaView style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#16a34a" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Artizana</Text>
            </View>

            {error ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Unable to load products.</Text>
                    <Text onPress={fetchProducts} style={styles.retryText}>Tap to Retry</Text>
                </View>
            ) : (
                <FlatList
                    ListHeaderComponent={
                        <>
                            <HeroSection />
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Top Picks for You</Text>
                                <Text style={styles.viewAllText}>View All</Text>
                            </View>
                        </>
                    }
                    data={products}
                    keyExtractor={(item: any) => item._id}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item}
                            onPress={() => handleProductPress(item._id)}
                        />
                    )}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#16a34a']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.centerContainer}>
                            <Text style={styles.emptyText}>No products found.</Text>
                        </View>
                    }
                />
            )}

            {/* Language Selection Modal */}
            <LanguageSelectorModal
                visible={showLanguageModal}
                onSelectLanguage={(lang: string) => {
                    selectLanguage(lang);
                    setShowLanguageModal(false);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // gray-50 equivalent
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    viewAllText: {
        fontSize: 14,
        color: '#4338ca', // Indigo color or green match
        fontWeight: '600',
    },
    listContent: {
        padding: 16,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    errorText: {
        color: '#ef4444',
        marginBottom: 8,
    },
    retryText: {
        color: '#16a34a',
        fontWeight: 'bold',
    },
    emptyText: {
        color: '#6b7280',
        marginTop: 20,
    }
});

export default HomeScreen;

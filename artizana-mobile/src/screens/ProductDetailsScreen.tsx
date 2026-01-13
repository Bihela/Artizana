import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, ShoppingCartIcon, StarIcon, FlagIcon, HeartIcon } from 'react-native-heroicons/outline';
import { StarIcon as StarIconSolid } from 'react-native-heroicons/solid';
import Carousel from '../components/Carousel';
import axios from 'axios';

// Define Route Param List (Ideally this should be in a types file)
type RootStackParamList = {
    ProductDetails: { productId: string };
};

type ProductDetailsRouteProp = RouteProp<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<ProductDetailsRouteProp>();
    const { productId } = route.params;

    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false); // State for wishlist

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            // Use environment variable for base URL
            const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://10.0.2.2:5001/api';
            const response = await axios.get(`${baseUrl}/products/${productId}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            Alert.alert('Error', 'Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

    if (!product) {
        return (
            <SafeAreaView style={styles.center}>
                <Text>Product not found</Text>
            </SafeAreaView>
        );
    }

    const { title, price, description, artisan, images, quantity: stock } = product;

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header / Top Bar */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <ArrowLeftIcon size={24} color="black" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                            style={styles.iconButton}
                            onPress={() => setIsWishlisted(!isWishlisted)}
                        >
                            <HeartIcon size={24} color={isWishlisted ? "red" : "black"} fill={isWishlisted ? "red" : "none"} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <ShoppingCartIcon size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Image Carousel */}
                <Carousel
                    images={images || []}
                    height={350}
                    autoPlay={false}
                />

                {/* Content Body */}
                <View style={styles.body}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.price}>LKR {price.toLocaleString()}</Text>
                    </View>

                    <View style={styles.stockRow}>
                        <Text style={[styles.stock, stock > 0 ? styles.inStock : styles.outStock]}>
                            {stock > 0 ? `Stock: ${stock} left` : 'Out of Stock'}
                        </Text>
                        <TouchableOpacity>
                            <FlagIcon size={20} color="gray" />
                        </TouchableOpacity>
                    </View>

                    {/* Artisan Info */}
                    {artisan && (
                        <View style={styles.artisanContainer}>
                            {artisan.profilePhoto ? (
                                <Image
                                    source={{ uri: artisan.profilePhoto }}
                                    style={styles.artisanImage}
                                />
                            ) : (
                                <View style={[styles.artisanImage, styles.artisanFallback]}>
                                    <Text style={styles.artisanInitial}>
                                        {artisan.name?.charAt(0).toUpperCase() || 'A'}
                                    </Text>
                                </View>
                            )}
                            <View>
                                <Text style={styles.artisanLabel}>Artisan</Text>
                                <Text style={styles.artisanName}>{artisan.name}</Text>
                            </View>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{description}</Text>

                    {/* Reviews Preview (Placeholder) */}
                    <View style={styles.reviewsContainer}>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.sectionTitle}>Reviews</Text>
                            <TouchableOpacity>
                                <Text style={styles.seeAll}>See All</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.ratingRow}>
                            <StarIconSolid size={20} color="#FFD700" />
                            <Text style={styles.ratingText}>4.5 (23 Reviews)</Text>
                        </View>

                        {/* Write a Review Placeholder */}
                        <View style={styles.writeReviewContainer}>
                            <Text style={styles.subSectionTitle}>Write a Review</Text>
                            <TextInput
                                style={styles.reviewInput}
                                placeholder="Share your thoughts..."
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                            />
                            <TouchableOpacity style={styles.submitReviewButton}>
                                <Text style={styles.submitReviewText}>Submit Review</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyButton}>
                        <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <TouchableOpacity onPress={() => setQuantity(Math.min(stock, quantity + 1))} style={styles.qtyButton}>
                        <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addToCartButton}>
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 50, // Adjust for status bar if not using SafeAreaView wrapper for whole screen
        paddingBottom: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    iconButton: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 8,
        borderRadius: 20,
    },
    body: {
        padding: 20,
        paddingBottom: 100, // Space for bottom bar
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 20,
        fontWeight: '600',
        color: '#16a34a', // green-600
    },
    stockRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    stock: {
        fontSize: 14,
        fontWeight: '500',
    },
    inStock: {
        color: '#16a34a',
    },
    outStock: {
        color: '#ef4444',
    },
    artisanContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        marginBottom: 20,
    },
    artisanImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    artisanLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    artisanName: {
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        lineHeight: 22,
        color: '#374151',
        marginBottom: 24,
    },
    reviewsContainer: {
        marginTop: 10,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    seeAll: {
        color: '#16a34a',
        fontWeight: '600',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#4b5563',
    },
    bottomBar: {
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 8,
        marginRight: 16,
    },
    qtyButton: {
        padding: 10,
    },
    qtyButtonText: {
        fontSize: 18,
        fontWeight: '600',
    },
    qtyText: {
        fontSize: 16,
        fontWeight: '600',
        paddingHorizontal: 12,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#16a34a',
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: 'center',
    },
    addToCartText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    writeReviewContainer: {
        marginTop: 20,
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 12,
    },
    subSectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151',
    },
    reviewInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 8,
        padding: 12,
        height: 100,
        marginBottom: 12,
        textAlignVertical: 'top',
    },
    submitReviewButton: {
        backgroundColor: '#16a34a',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'flex-end',
        paddingHorizontal: 20,
    },
    submitReviewText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    artisanFallback: {
        backgroundColor: '#d1fae5', // emerald-100
        alignItems: 'center',
        justifyContent: 'center',
    },
    artisanInitial: {
        color: '#059669', // emerald-600
        fontWeight: 'bold',
        fontSize: 18,
    }
});

export default ProductDetailsScreen;

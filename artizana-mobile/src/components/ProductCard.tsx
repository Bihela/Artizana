import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ShoppingBagIcon, StarIcon } from 'react-native-heroicons/solid';

const { width } = Dimensions.get('window');
const cardWidth = (width / 2) - 24; // 2 columns with padding

interface Product {
    _id: string;
    title: string;
    price: number;
    images?: string[];
    artisan?: {
        name: string;
    };
}

interface ProductCardProps {
    product: Product;
    onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
    const { title, price, images, artisan } = product;

    // Use state to track efficient image loading and fallback
    const [imgUri, setImgUri] = React.useState(images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');

    React.useEffect(() => {
        setImgUri(images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');
    }, [images]);

    const handleImageError = () => {
        // Fallback to "craft" themed placeholder
        setImgUri('https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80');
    };

    // Placeholder stub for Rating
    const ratingStub = 4.8;
    const reviewCountStub = 124;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.card}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imgUri }}
                    style={styles.image}
                    resizeMode="cover"
                    onError={handleImageError}
                />
            </View>

            <View style={styles.content}>
                <Text numberOfLines={1} style={styles.title}>{title}</Text>
                <Text style={styles.artisan}>By {artisan?.name || 'Artisan'}</Text>

                <View style={styles.ratingContainer}>
                    <StarIcon size={12} color="#FBBF24" />
                    <Text style={styles.ratingText}>{ratingStub} ({reviewCountStub})</Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.price}>LKR {price?.toLocaleString()}</Text>
                    <View style={styles.addButton}>
                        <ShoppingBagIcon size={16} color="white" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: cardWidth,
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        overflow: 'hidden'
    },
    imageContainer: {
        height: 150,
        backgroundColor: '#f3f4f6',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    artisan: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 10,
        color: '#9CA3AF',
        marginLeft: 4,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    addButton: {
        backgroundColor: '#16a34a',
        padding: 6,
        borderRadius: 20,
    }
});

export default ProductCard;

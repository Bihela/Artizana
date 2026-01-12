import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = 300;

const heroSlides = [
    {
        image: require('../../assets/hero-mask.png'),
        title: 'Mystical\nTraditions',
        subtitle: 'Explore the ancient art of Sri Lankan Raksha masks.'
    },
    {
        image: require('../../assets/hero-pottery.png'),
        title: 'Earthen\nElegance',
        subtitle: 'Hand-molded pottery shaped by generations of artisans.'
    },
    {
        image: require('../../assets/hero-batik.png'),
        title: 'Vibrant\nTextiles',
        subtitle: 'Intricate Batik patterns woven with passion and color.'
    }
];

const HeroSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    // Auto-play logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeIndRef.current < heroSlides.length - 1) {
                flatListRef.current?.scrollToIndex({ index: activeIndRef.current + 1, animated: true });
            } else {
                flatListRef.current?.scrollToIndex({ index: 0, animated: true });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Keep track of active index for the interval closure
    const activeIndRef = useRef(0);
    useEffect(() => {
        activeIndRef.current = activeIndex;
    }, [activeIndex]);

    const handleScroll = (event: any) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / width);
        setActiveIndex(index);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="cover" />
            <View style={styles.overlay} />
            <View style={styles.contentContainer}>
                <Text style={styles.title}>
                    {item.title}
                </Text>
                <Text style={styles.subtitle}>
                    {item.subtitle}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={heroSlides}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            />
            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {heroSlides.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            index === activeIndex ? styles.activeDot : styles.inactiveDot,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: HERO_HEIGHT,
        width: width,
        position: 'relative',
    },
    slide: {
        width: width,
        height: HERO_HEIGHT,
        justifyContent: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for text readability
    },
    contentContainer: {
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 60, // Space for dots
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
        lineHeight: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#E5E7EB', // gray-200 equivalent
        maxWidth: '90%',
    },
    pagination: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        flexDirection: 'row',
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#FFFFFF',
        transform: [{ scale: 1.2 }],
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default HeroSection;

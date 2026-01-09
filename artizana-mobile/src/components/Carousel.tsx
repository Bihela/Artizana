import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
    View,
    FlatList,
    Image,
    StyleSheet,
    useWindowDimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
    TouchableOpacity,
    ViewToken,
} from 'react-native';

interface CarouselProps {
    images: string[];
    altPrefix?: string;
    autoPlay?: boolean;
    interval?: number;
    height?: number;
}

const Carousel: React.FC<CarouselProps> = ({
    images,
    altPrefix = 'Image',
    autoPlay = false,
    interval = 5000,
    height = 300,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const { width } = useWindowDimensions();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Handle Autoplay
    useEffect(() => {
        if (autoPlay && images.length > 1) {
            startTimer();
        }
        return () => stopTimer();
    }, [activeIndex, autoPlay, interval, images.length]);

    const startTimer = () => {
        stopTimer();
        timerRef.current = setTimeout(() => {
            let nextIndex = activeIndex + 1;
            if (nextIndex >= images.length) {
                nextIndex = 0;
            }
            scrollToIndex(nextIndex);
        }, interval);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const scrollToIndex = (index: number) => {
        flatListRef.current?.scrollToOffset({
            offset: index * width,
            animated: true,
        });
        setActiveIndex(index);
    };

    const onScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);
        if (roundIndex !== activeIndex) {
            setActiveIndex(roundIndex);
        }
    }, [activeIndex]);

    // Handle manual scroll start/end to pause/resume autoplay
    const onScrollBeginDrag = () => stopTimer();
    const onScrollEndDrag = () => {
        if (autoPlay) startTimer();
    };

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            // We track via onScroll for smoother updates, but this can be a backup
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    if (!images || images.length === 0) {
        return (
            <View style={[styles.placeholder, { height, width }]}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/600x400?text=No+Image' }}
                    style={[styles.image, { width, height }]}
                    resizeMode="cover"
                />
            </View>
        );
    }

    const renderItem = ({ item, index }: { item: string; index: number }) => (
        <View style={{ width, height }}>
            <Image
                source={{ uri: item }}
                style={[styles.image, { width, height }]}
                resizeMode="cover"
                accessibilityLabel={`${altPrefix} ${index + 1}`}
            />
        </View>
    );

    return (
        <View style={[styles.container, { height }]}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item}-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                onScrollBeginDrag={onScrollBeginDrag}
                onScrollEndDrag={onScrollEndDrag}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                scrollEventThrottle={16}
                decelerationRate="fast"
            />

            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            { backgroundColor: index === activeIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)' },
                            index === activeIndex ? styles.activeDot : null
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#f0f0f0',
    },
    image: {
        backgroundColor: '#ddd',
    },
    placeholder: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
    },
    pagination: {
        position: 'absolute',
        bottom: 16,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        width: 10,
        height: 10,
    },
});

export default Carousel;

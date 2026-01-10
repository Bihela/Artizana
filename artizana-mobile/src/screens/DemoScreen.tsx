import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const DemoScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Feature Demo Area</Text>
                <Text style={styles.subtitle}>
                    This screen is a placeholder for testing future mobile features as requested.
                </Text>

                <View style={styles.placeholderBox}>
                    <Text style={styles.placeholderText}>Future Content Here</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#1F2937',
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 30,
    },
    placeholderBox: {
        width: '100%',
        height: 200,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed'
    },
    placeholderText: {
        color: '#9CA3AF',
        fontWeight: '500'
    }
});

export default DemoScreen;

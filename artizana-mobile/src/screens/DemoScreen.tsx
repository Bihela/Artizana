import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DemoScreen = () => {
    const navigation = useNavigation<any>();
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

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('ProductDetails', { productId: '69651ab3e658b8da455fb711' })}
                >
                    <Text style={styles.buttonText}>Open Test Product (Fake/1)</Text>
                </TouchableOpacity>
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
    },
    button: {
        marginTop: 20,
        backgroundColor: '#16a34a',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});

export default DemoScreen;

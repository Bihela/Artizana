import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bars3Icon, Cog6ToothIcon } from "react-native-heroicons/outline";

const TopBar = () => {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.row}>
                <TouchableOpacity style={styles.iconBtn}>
                    <Bars3Icon size={24} color="#374151" />
                </TouchableOpacity>

                <Text style={styles.title}>Artizana</Text>

                <TouchableOpacity style={styles.iconBtn}>
                    <Cog6ToothIcon size={24} color="#374151" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default TopBar;

const styles = StyleSheet.create({
    safe: {
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    iconBtn: {
        padding: 4,
        width: 40,
        alignItems: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },
});

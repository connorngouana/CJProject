import * as React from "react"
import { Text, View } from "react-native"

export default function FeedScreen({navigation}) {
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Text onPress={() => navigation.navigate("Home")}
            style={{fontSize: 26, fontWeight: "bold",}}>Feed 

            </Text>
        </View>
    )
}
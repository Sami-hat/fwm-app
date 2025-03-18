import { useNavigation } from "@react-navigation/native";
import { Header } from "../components/Header";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Button, Text, ListItem } from "@rneui/themed";
import Feather from "@expo/vector-icons/Feather";
import { React, useState, useEffect } from "react";

export const ProfilePage = ({ ip, userId, setUserId, setRecipe }) => {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const navigation = useNavigation();
  const [ingredients, setIngredients] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://${ip}:3001/api/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      const data = await res.text();
      const parsedResponse = JSON.parse(data);
      setResponse(parsedResponse);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  // Get user's recipes
  useEffect(() => {
    if (ingredients.length > 0) {
      setResponse([]);
      handleSubmit();
    }
  }, [ingredients]);

  // Get user's inventory
  useEffect(() => {
    if (userId >= 1) {
      fetch(`http://${ip}:3001/api/inventory/names?user=${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setIngredients(data);
          const ingredientsString = data.join(", ");

          const chatPrompt =
            "take this list of ingredients and return a list of recipes names which can be made from them. Provide nothing else outside an array of data which can be fetched from an API call and re-inputted into code with no parsing Ingredients: " +
            " Follow this exact format [{recipe_name: value, ingredients_needed: values, instructions: values}]. Give very very exact instruction including temperature and time for cooking/baking and in what appliances, and what quantities are needed for the ingredients, there should be no embedded JSON objects at all" +
            ingredientsString;

          setPrompt(chatPrompt);
        });
    }
  }, [userId]);

  const handleLogout = async () => {
    setUserId(0);
  };

  return (
    <View style={styles.container}>
      <Header />

      {/* If userId >= 1, user is signed in/up */}
      {userId < 1 ? (
        // Displayed if user not signed in
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <View style={styles.banner}>
            <Text h4 style={styles.welcomeText}>
              Welcome! Please sign up or log in to access your profile.
            </Text>
          </View>

          <Button
            title="Sign Up"
            onPress={() => navigation.navigate("SignUp")}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          <Button
            title="Log In"
            onPress={() => navigation.navigate("Login")}
            buttonStyle={styles.button}
            titleStyle={styles.buttonText}
          />

          <View style={styles.statisticsBox}>
            <Text h3 style={styles.statisticsTitle}>
              Your Statistics
            </Text>
            <Text style={styles.statisticsText}>
              Make an account or log in to see statistics. Once you make an
              account, you will be able to see your past meals here.
            </Text>
          </View>
        </View>
      ) : (
        // Displayed if user signed in
        <View>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {/* Scan Barcode */}
            <Button
              title="Scan Barcode     "
              iconRight
              icon={<Feather name="grid" size={18} color="white" />}
              onPress={() => navigation.navigate("Scanner")}
              buttonStyle={{
                ...styles.loggedInButton,
                backgroundColor: "#B8528A",
              }}
              titleStyle={styles.buttonText}
            />
            {/* Take Image */}
            <Button
              title="Take Image     "
              icon={<Feather name="camera" size={18} color="white" />}
              iconRight
              onPress={() => navigation.navigate("Camera")}
              buttonStyle={{
                ...styles.loggedInButton,
                backgroundColor: "#D8A052",
              }}
              titleStyle={styles.buttonText}
            />
            {/* Log Out */}
            <Button
              title="Log Out     "
              icon={<Feather name="log-out" size={18} color="white" />}
              iconRight
              onPress={() => handleLogout()}
              buttonStyle={{
                ...styles.loggedInButton,
                backgroundColor: "#5295B7FF",
              }}
              titleStyle={styles.buttonText}
            />
          </View>

          {/* Recipes */}
          <View style={{ maxHeight: windowHeight * 0.5 }}>
            <Text h4 style={styles.header}>
              Suggested Recipes:
            </Text>
            {ingredients.length > 0 ? (
              response.length > 0 ? (
                <FlatList
                  data={response}
                  keyExtractor={(item) => item.recipe_name}
                  renderItem={({ item }) => (
                    <ListItem
                      bottomDivider
                      onPress={() => {
                        setRecipe(item);
                        navigation.navigate("Recipe");
                      }}
                    >
                      <ListItem.Content>
                        <ListItem.Title>{item.recipe_name}</ListItem.Title>
                      </ListItem.Content>
                    </ListItem>
                  )}
                />
              ) : (
                <Text>Finding recipes...</Text>
              )
            ) : (
              <Text>No ingredients in inventory.</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: Dimensions.get("window").width * 0.85,
    backgroundColor: "#52B788",
    height: Dimensions.get("window").height * 0.08,
    margin: "3%",
    alignItems: "center",
    borderRadius: 10,
    justifyContent: "center",
  },
  loggedInButton: {
    width: Dimensions.get("window").width * 0.85,
    height: Dimensions.get("window").height * 0.07,
    marginVertical: "2%",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  statisticsBox: {
    width: "85%",
    backgroundColor: "#52B788",
    padding: "5%",
    marginTop: "5%",
    borderRadius: 10,
    alignItems: "center",
  },
  statisticsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: "5%",
    color: "#FFFFFF",
  },
  statisticsText: {
    fontSize: 18,
    color: "#FFFFFF",
  },

  banner: {
    width: "110%",
    backgroundColor: "#5295B7FF",
    padding: "7%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "5%",
  },
  welcomeText: {
    fontSize: 22,
    textAlign: "center",
    color: "#FFFFFF",
  },
  header: {
    fontSize: 30,
    textAlign: "left",
    lineHeight: 70,
    color: "black",
  },
});

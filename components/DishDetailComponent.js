import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Picker,
  Switch,
  Button,
  FlatList,
  TextInput,
  Modal
} from "react-native";
import { Card, Icon, Rating, Input } from "react-native-elements";
import { connect } from "react-redux";
import { baseUrl } from "../shared/baseUrl";
import { postFavorite, postComment } from "../redux/ActionCreators";

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    favorites: state.favorites
  };
};

const mapDispatchToProps = dispatch => ({
  postFavorite: dishId => dispatch(postFavorite(dishId))
});

function RenderDish(props) {
  const dish = props.dish;

  if (dish != null) {
    return (
      <Card featuredTitle={dish.name} image={{ uri: baseUrl + dish.image }}>
        <Text style={{ margin: 10 }}>{dish.description}</Text>
        <View style={styles.cardRow}>
          <Icon
            raised
            reverse
            name={props.favorite ? "heart" : "heart-o"}
            type="font-awesome"
            color="#f50"
            onPress={() =>
              props.favorite
                ? console.log("Already favorite")
                : props.onMarkFavorite()
            }
          />
          {/* <View style={styles.cardItem}> */}
          <Icon
            raised
            reverse
            name="pencil"
            type="font-awesome"
            color="#512DA8"
            onPress={() => props.onShowModal()}
          />
          {/* </View> */}
        </View>
      </Card>
    );
  } else {
    return <View />;
  }
}

function RenderComments(props) {
  const comments = props.comments;

  const renderCommentItem = ({ item, index }) => {
    return (
      <View key={index} style={{ margin: 10 }}>
        <Text style={{ fontSize: 14 }}>{item.comment}</Text>
        <Rating
          style={{ alignSelf: "flex-start" }}
          count={5}
          startingValue={+item.rating}
          imageSize={12}
          readonly
        />
        <Text style={{ fontSize: 12 }}>
          {"-- " + item.author + ", " + item.date}
        </Text>
      </View>
    );
  };
  return (
    <Card title="Comments">
      <FlatList
        data={comments}
        renderItem={renderCommentItem}
        keyExtractor={item => item.id.toString()}
      />
    </Card>
  );
}

class DishDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rating: 5,
      author: [],
      comment: [],
      showModal: false
    };
  }

  markFavorite(dishId) {
    this.props.postFavorite(dishId);
  }

  // onShowModal(dishId) {
  //   this.props.postComment(dishId);
  // }

  static navigationOptions = {
    title: "Dish Details"
  };

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  handleComment() {
    console.log(JSON.stringify(this.state));
    this.toggleModal();
  }

  resetForm() {
    this.setState({
      rating: 5,
      author: [],
      comment: [],
      showModal: false
    });
  }

  render() {
    const dishId = this.props.navigation.getParam("dishId", "");
    return (
      <ScrollView>
        <RenderDish
          dish={this.props.dishes.dishes[+dishId]}
          favorite={this.props.favorites.some(el => el === dishId)}
          onMarkFavorite={() => this.markFavorite(dishId)}
          onShowModal={() => {
            this.toggleModal();
          }}
        />
        <RenderComments
          comments={this.props.comments.comments.filter(
            comment => comment.dishId === dishId
          )}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showModal}
          onDismiss={() => this.toggleModal()}
          onRequestClose={() => this.toggleModal()}
        >
          <View style={styles.modal}>
            <Rating
              count={5}
              showRating
              defaultRating={5}
              startingValue={5}
              onFinishRating={rating => this.setState({ rating: rating })}
              size={1}
            />
            <Text style={styles.modalText}>Author: {this.state.author}</Text>
            <Input
              placeholder=" Your Name"
              leftIcon={<Icon name="user-o" type="font-awesome" size={24} />}
              onChangeText={author => this.setState({ author: author })}
            />
            <Text style={styles.modalText}>Comment: {this.state.comment}</Text>
            <Input
              placeholder=" Your Comment"
              leftIcon={<Icon name="comment-o" type="font-awesome" size={24} />}
              onChangeText={comment => this.setState({ comment: comment })}
            />
            <View style={{ marginTop: 10 }}>
              <Button
                onPress={() => {
                  this.handleComment();
                  this.resetForm();
                }}
                color="#512DA8"
                title="Submit"
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <Button
                onPress={() => {
                  this.toggleModal();
                  this.resetForm();
                }}
                color="#808080"
                title="Cancel"
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  cardRow: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    margin: 20
  },
  cardItem: {
    flex: 1
  },
  modal: {
    justifyContent: "center",
    margin: 20
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DishDetail);

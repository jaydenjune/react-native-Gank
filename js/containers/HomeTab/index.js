/**
 * Created by wangdi on 23/11/16.
 */
'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux';
import * as Actions from '../../actions/requestData';
import {StyleSheet, View, Text, ScrollView, Image, ListView, TouchableNativeFeedback, TouchableHighlight} from 'react-native';
import theme from '../../constants/theme';
import px2dp from '../../utils/px2dp';
import NavigationBar from '../../components/NavigationBar';
import getDate from '../../utils/getCurrentDate';
import * as Info from '../../utils/handleDataSource';
import SimpleList from '../../components/SimpleListView';
import colors from '../../constants/colors';

class HomeFragment extends Component{
    constructor(props){
        super(props);
        this.state = {
            opacity: 0,
        };
        this.imageHeight = px2dp(400);
    }

    render(){
        const dataSource = this.props.dataSource;
        return(
            <View style={styles.container}>
                <View style={[styles.toolbar, {opacity: this.state.opacity}]}>
                    <NavigationBar title="今日干货" rightBtnIcon="calendar" rightBtnPress={this._onPress.bind(this, 0)}/>
                </View>
                <ScrollView
                    scrollEnabled={this.state.scrollEnabled}
                    onScroll={this._onScroll.bind(this)}>
                    {this.props.loading ?
                        <Text>loading</Text>
                        :
                        <View>
                            <View style={{height: this.imageHeight, width: theme.screenWidth}}>
                                <ImageView
                                    imgUrl={Info.getFuLiUrl(dataSource)}
                                    labelTime={getDate()}/>
                            </View>
                            <View style={styles.scrollContents}>
                                {Info.getCategoryList(dataSource).map((item, i) => {
                                    if(item !== '福利')
                                    return <SimpleList key={i} dataSource={Info.getTargetList(dataSource, item)} headerTitle={item}/>
                                })}
                            </View>
                            <View style={{width: theme.screenWidth, alignItems: 'center'}}>
                                <TouchableHighlight
                                    onPress={this._onPress.bind(this, 1)}
                                    underlayColor={theme.touchableHighlightUnderlayColor}>
                                    <View style={styles.bottomBtn}>
                                        <Text style={styles.btnLabel}>没看够？试试往期干货吧</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    }
                </ScrollView>
            </View>
        );
    }

    _onPress(id) {
        if (id === 0)
            this.props.actions.fetchData(getDate());
        else if (id === 1)
            ;
    }


    _onScroll(event){
        var offsetY = event.nativeEvent.contentOffset.y;
        if(offsetY <= this.imageHeight - theme.toolbar.height){
            var opacity = offsetY / (this.imageHeight - theme.toolbar.height);
            this.setState({opacity: opacity});
        }else{
            this.setState({opacity: 1});
        }
    }

}

class ImageView extends Component{
    static propTypes = {
        imgUrl: PropTypes.string,
        labelTime: PropTypes.string
    }

    render(){
        return(
            <View style={styles.container}>
                <Image source={{uri: this.props.imgUrl}} style={styles.img}/>
                <View style={styles.dateLabel}>
                    <Text style={styles.label}>{this.props.labelTime}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.pageBackgroundColor
    },
    toolbar: {
        position: 'absolute',
        width: theme.screenWidth,
        zIndex: 1
    },
    scrollContents: {
        height: theme.screenHeight,
    },
    img: {
        width: theme.screenWidth,
        height: px2dp(400),
        resizeMode: 'cover'
    },
    dateLabel: {
        backgroundColor: 'rgba(0,0,0,.5)',
        position: 'relative',
        width: theme.screenWidth,
        height: px2dp(50),
        bottom: px2dp(50),
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    label: {
        color: '#fff',
        fontSize: px2dp(20),
        marginRight: px2dp(20),
        fontWeight: 'bold'
    },
    bottomBtn: {
        backgroundColor: colors.lightBlue,
        width: theme.screenWidth*0.8,
        height: 40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 3,
        margin: 15
    },
    btnLabel: {
        color: '#fff',
        fontSize: 16
    }
});

const mapStateToProps = (state) => {
    return {
        dataSource: state.data.dataSource,
        loading: state.data.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFragment);
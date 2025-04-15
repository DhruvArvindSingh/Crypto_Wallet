import React from 'react';
import { View, Text, Animated } from 'react-native';
import { COLORS, SIZES, icons } from '@/constants';

import { connect } from 'react-redux';
import IconTextButton from '@/components/IconTextButton';       


const MainLayout = ({ children, isTradeModalVisible }: { children: React.ReactNode, isTradeModalVisible: boolean }) => {
    const modalAnimatedValue = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if(isTradeModalVisible) {   
            Animated.timing(modalAnimatedValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(modalAnimatedValue, {
                toValue: 0,
                duration: 500,
                useNativeDriver: false,
            }).start();
        }
    }, [isTradeModalVisible]);

    const modalY = modalAnimatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [SIZES.height, SIZES.height - 280],
    });

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            {children}
            {
                isTradeModalVisible && 
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: COLORS.transparentBlack,
                            opacity: modalAnimatedValue,
                        }}
                    />
            }
            <Animated.View
                style={{
                    position: 'absolute',
                    top: modalY,
                    left: 0,
                    width: "100%",
                    padding: SIZES.padding,
                    backgroundColor: COLORS.primary,
                }}
            >
                <IconTextButton
                    label="Transfer"
                    icon={icons.send}
                    containerStyle={{
                        width: "100%",
                        height: 50,
                        borderRadius: SIZES.radius,
                    }}
                    onPress={() => {
                        console.log("send");
                    }}
                />
                <IconTextButton
                    label="Withdraw"
                    icon={icons.withdraw}
                    onPress={() => {
                        console.log("receive");
                    }}
                    containerStyle={{
                        marginTop: SIZES.base,
                    }}
                />
            </Animated.View>
        </View>
    );
}



function mapStateToProps(state: any) {
    return {
      isTradeModalVisible: state.tabReducer.isTradeModalVisible
    }
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(MainLayout)

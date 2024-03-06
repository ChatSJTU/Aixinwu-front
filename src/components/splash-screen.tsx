import { Space, Flex } from 'antd';
import { AxwLogo } from './axw-logo';
import { LoadingSpin } from './loading-spin';

const SplashScreen = () => {
  return (
    <Flex 
      style={{height: "100vh", width: "100vw", background: "#FFF"}}
      justify="center" 
      align="center">
      <Space size="middle" direction="vertical">
        <Space size="middle" direction="horizontal">
            <AxwLogo fill="#cbcdd1" size={60}></AxwLogo>
            <span style={{color: "#cbcdd1", fontWeight: "bold", fontSize: "20px"}}>上海交通大学爱心屋</span>
        </Space>
        <Flex justify="center">
            <LoadingSpin size={60} style={{color: "#cbcdd1"}}></LoadingSpin>
        </Flex>
      </Space>
    </Flex>
  )
}

export default SplashScreen

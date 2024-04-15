import {
  Grid,
  InputNumber,
  Typography,
  Image,
  Button,
  Collapse,
  Space,
  Table, Flex,
  Popconfirm,
} from 'antd';
const { Column } = Table;
const { Paragraph } = Typography;
import {AxCoin} from "@/components/axcoin";
import React from "react";
const { Title, Text, Link } = Typography;
const { Panel } = Collapse;
import { CheckoutLineDetail, CheckoutTableListProps } from '@/models/checkout';
const { useBreakpoint } = Grid;


export const CheckoutTableList: React.FC<CheckoutTableListProps> = (
  {
    CheckoutLines,
    onClickDelete,
    onItemNumberChange,
    onItemNumberMinus,
    onItemNumberPlus,
  }
) => {
  const screens = useBreakpoint();
  // 确认订单界面，左边的一列商品信息：图、标题、单价、购买数量、小记、删除
  if (screens.md) {
    return (
      <div className="container">
        <Table
          dataSource={CheckoutLines}
        >
          <Column
            title="图片"
            width="15%"
            align="center"
            render={(_, line: CheckoutLineDetail) => (
                <Image src={line.varient.product_thumbnail} preview={false}/>
            )}
          />
          <Column
            title="商品"
            ellipsis={true}
            width="35%"
            render={(_, line: CheckoutLineDetail) => (
              <Space
                direction="vertical"
                style={{maxWidth: "100%"}}
              >
                      <span style={{
                        fontSize: "14px", fontWeight: "bold",
                        overflow: "hidden", maxWidth: "100%"
                      }}>

                      </span>
                <Text
                  strong={true}
                  ellipsis={true}
                >
                  {line.varient.product_name}
                </Text>
                <Paragraph
                  type="secondary"
                  style={{
                    fontSize: "12px", color: "gray",
                    whiteSpace: "pre-wrap"
                  }}
                  ellipsis={{rows: 2, expandable: false}}
                >
                  {line.varient.product_category}
                </Paragraph>
              </Space>
            )}
          />
          <Column
            title="单价"
            width="10%"
            align="center"
            render={(_, line: CheckoutLineDetail) => (
              <div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                <AxCoin value={line.varient.price} coloredValue/>
              </div>
            )}
          />
          <Column
            title="数量"
            width="20%"
            align="center"
            ellipsis={true}
            render={(_, line: CheckoutLineDetail) => (
              <Space
                direction="vertical"
                style={{width: '100%'}}
                align={'center'}
              >
                <Space.Compact style={{width: '60%'}}>
                  <Button
                    style={{width: '25%', padding: 0}}
                    size="small"
                    // type="ghost"
                    // style={{paddingLeft: '10%', paddingRight: '10%'}}
                    onClick={() => onItemNumberMinus(line.id)}
                    disabled={line.quantity <= 1}
                  >
                    -
                  </Button>
                  <InputNumber
                    style={{width: '50%'}}
                    size="small"
                    min={1} max={50} value={line.quantity}
                    controls={false}
                    onChange={value => {
                      if (value !== null) {
                        onItemNumberChange(line.id, value);
                      }
                    }}
                  />
                  <Button
                    style={{width: '25%', padding: 0}}
                    size="small"
                    // type="ghost"
                    // style={{paddingLeft: '10%', paddingRight: '10%'}}
                    onClick={() => onItemNumberPlus(line.id)}
                    disabled={line.quantity >= 50}
                  >
                    +
                  </Button>
                </Space.Compact>
                <Text style={{
                  fontSize: '12px',
                  color: "gray",
                  display: 'flex',
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  库存：（Todo）
                </Text>
              </Space>
            )}
          />
          <Column
            title="小计"
            align="center"
            width="10%"
            render={(_, line: CheckoutLineDetail) => (
              <div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                <AxCoin value={line.totalPrice} coloredValue/>
              </div>
            )}
          />
          <Column
            title="  "
            align="center"
            width="10%"
            ellipsis={true}
            render={(_, line: CheckoutLineDetail) => (
              <Popconfirm
                title="删除购物车商品"
                description="确定要执行此操作吗？"
                onConfirm={() => onClickDelete(line.id)}
                onCancel={() => {}}
                okText="确定"
                cancelText="取消"
              >
                <Button style={{padding: 0}} type="link">删除</Button>
              </Popconfirm>
            )}
          />
        </Table>
      </div>
    )
  }
  else {
    return (
      <div className="container">
        <Table
          dataSource={CheckoutLines}
        >
          <Column
            title={""}
            width="100%"
            align="center"
            ellipsis={true}
            render={(_, line: CheckoutLineDetail) => (
              <div>
              <Flex align="space-between">
                <div className="container" style={{aspectRatio: "1/1", overflow: "auto", width: "40%"}}>
                  <Image src={line.varient.product_thumbnail} preview={false} style={{objectFit: "cover", aspectRatio: "1/1"}}/>
                </div>
                   <Flex
                     vertical
                     style={{width: "60%"}}
                     align="flex-start"
                     justify="space-evenly"
                   >
                     <Text
                       strong={true}
                       ellipsis={true}
                       style={{
                         margin: '0px',
                         height: '20%',
                       }}
                     >
                       {line.varient.product_name}
                     </Text>
                     <Paragraph
                       type="secondary"
                       style={{
                         margin: '0px',
                         fontSize: "12px", color: "gray",
                         whiteSpace: "pre-wrap",
                         height: '30%'
                       }}
                       ellipsis={{rows: 2, expandable: false}}
                     >
                       {line.varient.product_category}
                     </Paragraph>

                     <Flex
                       justify="space-between"
                     >
                    <Space>
                       <div style={{display: 'flex', alignItems: "center", justifyContent: "center"}}>
                         {/* <AxCoin size={22}/> <span style={{color: '#eb2f96'}}>{x.cost}</span> */}
                         <AxCoin size={22} value={line.varient.price} coloredValue/>

                       </div>
                       <Space.Compact style={{width: '110%'}}>
                         <Button
                           style={{width: '27%', padding: 0}}
                           // size="small"
                           // type="ghost"
                           // style={{paddingLeft: '10%', paddingRight: '10%'}}
                           onClick={() => onItemNumberMinus(line.id)}
                           disabled={line.quantity <= 1}
                         >
                           -
                         </Button>
                         <InputNumber
                           style={{width: '46%', padding: 0}}
                           // size="small"
                           min={1} max={50} value={line.quantity}
                           controls={false}
                           onChange={value => {
                             if (value !== null) {
                               onItemNumberChange(line.id, value);
                             }
                           }}
                         />
                         <Button
                           style={{width: '27%', padding: 0}}
                           // size="small"
                           // type="ghost"
                           // style={{paddingLeft: '10%', paddingRight: '10%'}}
                           onClick={() => onItemNumberPlus(line.id)}
                            disabled={line.quantity >= 50}
                         >
                           +
                         </Button>
                       </Space.Compact>

                       <Button style={{padding: 0}} type="link"
                           onClick={(() => onClickDelete(line.id))}>删除
                       </Button>
                    </Space>   
                     </Flex>
                   </Flex>
              </Flex>
              </div>
            )}
          />
        </Table>
      </div>
    )
  }

}
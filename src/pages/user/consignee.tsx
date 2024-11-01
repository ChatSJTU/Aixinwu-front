import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { Form, Modal, Input, Card, List, Button, Space, Spin, Tag, Select } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { addUserAddress, deleteUserAddress, updateUserAddress, fetchUserAddresses, setDefaultUserAddress } from "@/services/user";
import AuthContext from "@/contexts/auth";
import { MessageContext } from '@/contexts/message';
import { AddressInfo } from "@/models/address";
import { PageHeader } from "@/components/page-header";
import { AddressInput } from "@/graphql/hooks";
import { NotificationContext } from "@/contexts/notification";

const UserConsigneePage = () => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("新增收货地址");
    const [editingAddr, setEditingAddr] = useState<AddressInfo | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    const [addrList, setAddrList] = useState<AddressInfo[] | undefined>(undefined)
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const noti = useContext(NotificationContext);
    const client = authCtx.client;

    useEffect(() => {
        fetchAddress();
    }, [])


    const fetchAddress = () => {
        fetchUserAddresses(client!)
            .then(res => setAddrList(res))
            .catch(err => message.error(err))
    }

    const handleAddressAdd = (NewAddr: AddressInput) => {
        addUserAddress(client!, NewAddr)
            .then(() => {
                setIsModalVisible(false);
                if (NewAddr.streetAddress1 == "徐汇校区" || NewAddr.streetAddress1 == "黄浦校区") {
                    // noti.info({
                    //     message: "温馨提示",
                    //     description: "收货地址为徐汇黄浦校区的同学请加QQ群：321557314，否则无法收到收货信息。",
                    //     duration: 30,
                    // });
                    setModalOpen(true);
                }
                fetchAddress();
            })
            .catch(err => message.error(err))
    }

    const handleAddressDelete = (ID: string) => {
        deleteUserAddress(client!, ID)
            .then(() => fetchAddress())
            .catch(err => message.error(err))
    }

    const handleAddressUpdate = (ID: string, NewAddr: AddressInput) => {
        updateUserAddress(client!, ID, NewAddr)
            .then(() => {
                setIsModalVisible(false);
                fetchAddress();
            })
            .catch(err => message.error(err))
    }

    const handleSetDefaultAddress = (id: string) => {
        setDefaultUserAddress(client!, id)
            .then(() => {
                setIsModalVisible(false);
                fetchAddress();
            })
            .catch(err => message.error(err));
    };

    const showModal = (addr?: AddressInfo) => {
        if (addr) {
            let formValue: any = addr;
            formValue.fullname = addr.firstName;
            setModalTitle("编辑收货地址");
            setEditingAddr(addr);
            form.setFieldsValue(addr);
        } else {
            setModalTitle("新增收货地址");
            setEditingAddr(null);
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleSubmit = (values: any) => {
        let modifiedValues: any = values;
        let firstName = values.fullname;
        let lastName = "";
        delete modifiedValues.fullname;
        modifiedValues.country = "CN";
        modifiedValues.firstName = firstName;
        modifiedValues.lastName = lastName;
        modifiedValues.countryArea = "上海市";
        modifiedValues.city = "闵行区";
        modifiedValues.cityArea = "";

        if (editingAddr) {
            handleAddressUpdate(editingAddr.id, modifiedValues as AddressInput);
        } else {
            handleAddressAdd(modifiedValues as AddressInput);
        }
    };

    if (!addrList) {
        return (
            <center><Spin size="large" style={{ marginTop: '200px' }} /></center>
        );
    }

    return (
        <>
            <Head>
                <title>收货信息管理- 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <PageHeader title={"收货信息管理"} />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>新增收货地址</Button>
                </div>
                <div className="address-list-container" style={{ maxHeight: '400px', marginTop: '30px' }}>
                    <Space direction="vertical" size="small">
                        <List
                            grid={{ gutter: 14, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
                            dataSource={addrList}
                            renderItem={(item) => (
                                <List.Item>
                                    <div>
                                        <Card className='address-card'
                                            title={
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                    <div>
                                                        <span>{`${item.firstName}`}</span>
                                                        {item.isDefaultShippingAddress &&
                                                            <Tag color="blue" style={{ marginLeft: '12px' }}>默认</Tag>
                                                        }
                                                    </div>
                                                    <div>
                                                        {!item.isDefaultShippingAddress &&
                                                            <Button size={"small"} type={"text"} icon={<HomeOutlined />} onClick={() => { handleSetDefaultAddress(item.id) }} title="设为默认" />
                                                        }
                                                        <Button size={"small"} type={"text"} icon={<EditOutlined />} onClick={() => { showModal(item) }} title="编辑" />
                                                        <Button size={"small"} type={"text"} icon={<DeleteOutlined />} style={{ color: '#ff4d4f' }} onClick={() => { handleAddressDelete(item.id) }} title="删除"/>
                                                    </div>
                                                </div>
                                            }>
                                            {`${item.phone === "" ? '/' : item.phone}, ${item.streetAddress1}, 上海交通大学`}
                                        </Card>
                                    </div>
                                </List.Item>
                            )}
                        />
                    </Space>
                </div>
                <center>
                    <Modal title={modalTitle} open={isModalVisible} onCancel={handleCancel} onOk={() => form.submit()}>
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Form.Item name="fullname" label="姓名" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            {/* <Form.Item name="countryArea" label="省或直辖市" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="city" label="城市" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="cityArea" label="区/县" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item> */}
                            <Form.Item name="streetAddress1" label="校区" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="闵行校区">闵行校区</Select.Option>
                                    <Select.Option value="徐汇校区">徐汇校区</Select.Option>
                                    <Select.Option value="黄浦校区">黄浦校区</Select.Option>
                                    <Select.Option value="长宁校区">长宁校区</Select.Option>
                                    <Select.Option value="张江校区">张江校区</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="phone" label="电话号码" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            {/*
                            <Form.Item name="postalCode" label="邮政编码" rules={[{ required: false }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="companyName" label="单位名称" rules={[{ required: false }]}>
                                <Input />
                            </Form.Item>
                            */}
                        </Form>
                    </Modal>
                </center>
            </UserLayout>
            <Modal
                title="温馨提示"
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
            >
                <p>收货地址为徐汇黄浦校区的同学请加QQ群：321557314，否则无法收到收货信息。</p>
            </Modal>
        </>
    );
};
export default UserConsigneePage;
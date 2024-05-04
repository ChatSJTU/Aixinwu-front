import { useContext, useEffect, useState } from "react";
import Head from "next/head";
import UserLayout from "@/components/user-center-layout"
import { Form, Modal, Input, Card, List, Button, Space, Spin } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { addUserAddress, deleteUserAddress, updateUserAddress, fetchUserAddresses } from "@/services/user";
import AuthContext from "@/contexts/auth";
import { MessageContext } from '@/contexts/message';
import { AddressInfo } from "@/models/address";
import { PageHeader } from "@/components/page-header";

const UserConsigneePage = () => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [modalTitle, setModalTitle] = useState<string>("新增收货地址");
    const [editingAddr, setEditingAddr] = useState<AddressInfo | null>(null);
    const [form] = Form.useForm();

    const [addrList, setAddrList] = useState<AddressInfo[] | undefined>(undefined)
    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;

    useEffect(() => {
        fetchAddress();
    }, [])

    const fetchAddress = () => {
        fetchUserAddresses(client!)
            .then(res => setAddrList(res))
            .catch(err => message.error(err))
    }

    const handleAddressAdd = (NewAddr: any) => {
        addUserAddress(client!, NewAddr)
            .then(() => fetchAddress())
            .catch(err => message.error(err))
    }

    const handleAddressDelete = (ID: string) => {
        deleteUserAddress(client!, ID)
            .then(() => fetchAddress())
            .catch(err => message.error(err))
    }

    const handleAddressUpdate = (ID: string, NewAddr: any) => {
        updateUserAddress(client!, ID, NewAddr)
            .then(() => fetchAddress())
            .catch(err => message.error(err))
    }

    const showModal = (addr?: AddressInfo) => {
        if (addr) {
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

    const handleSubmit = (values: AddressInfo) => {
        let modifiedValues: any = values;
        modifiedValues.country = values.country.code
        if (editingAddr) {
            handleAddressUpdate(editingAddr.id, modifiedValues);
        } else {
            handleAddressAdd(modifiedValues);
        }
        setIsModalVisible(false);
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
                <PageHeader title={"收货信息管理"} />
                <center>
                    <div className="address-list-container" style={{ maxHeight: '400px' }}>
                        <Space direction="vertical" size="small" style={{ maxWidth: '600px' }}>
                            <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} block>新增收货地址</Button>
                            <List
                                grid={{ gutter: 8, column: 2 }}
                                dataSource={addrList}
                                renderItem={(item) => (
                                    <List.Item>
                                        <div className="address-card-container">
                                            <Card className='address-card'
                                                title={
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                        <span>{`${item.firstName} ${item.lastName}`}</span>
                                                        <div>
                                                            <Button size={"small"} type={"text"} icon={<EditOutlined />} onClick={() => { showModal(item) }} />
                                                            <Button size={"small"} type={"text"} icon={<DeleteOutlined />} style={{ color: '#ff4d4f' }} onClick={() => { handleAddressDelete(item.id) }} />
                                                        </div>
                                                    </div>
                                                }>
                                                {`${item.phone === "" ? '/' : item.phone},${item.city}, ${item.postalCode}, ${item.countryArea}, ${item.country.country}`}
                                            </Card>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Space>
                    </div>
                    <Modal title={modalTitle} open={isModalVisible} onCancel={handleCancel} onOk={() => form.submit()}>
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Form.Item label="姓名" rules={[{ required: true }]}>
                                <Space.Compact block>
                                    <Form.Item name="firstName" noStyle>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="lastName" noStyle>
                                        <Input />
                                    </Form.Item>
                                </Space.Compact>
                            </Form.Item>
                            <Form.Item name={["country", "code"]} label="国家" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="countryArea" label="省" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="city" label="城市" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="cityArea" label="区县" rules={[{ required: false }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="phone" label="电话号码" rules={[{ required: false }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="postalCode" label="邮政编码" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="companyName" label="单位名称" rules={[{ required: true }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="streetAddress1" label="街道1" rules={[{ required: false }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="streetAddress2" label="街道2" rules={[{ required: false }]}>
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </center>
            </UserLayout>
        </>
    );
};
export default UserConsigneePage;
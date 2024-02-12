import { Button, Form, Input, InputNumber, Row, Col, Space } from "antd";
import { PreDonationFormProps } from "@/models/pre-donation";

export const PreDonationForm = () => {
    const [form] = Form.useForm();

    return (
        <Form
            initialValues={{ remember: false }}
            autoComplete="off" 
            form={form}
        >
            <Space direction="vertical" style={{width: "100%"}}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item<PreDonationFormProps>
                        label="物品名称"
                        name="name"
                        rules={[{ required: true, message: "请输入物品名称" }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item<PreDonationFormProps>
                        label="物品数量"
                        name="number"
                        rules={[{ required: true, message: "请输入物品数量" }]}
                    >
                        <InputNumber style={{ width: "100%" }} precision={0} min={1}/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item<PreDonationFormProps>
                        label="评估总价值"
                        name="value"
                        rules={[{ required: true, message: "请输入评估总价值" }]}
                    >
                        <InputNumber prefix="￥" style={{ width: "100%" }} precision={2} min={1}/>
                    </Form.Item>
                </Col>
            </Row>
            <div style={{ textAlign: "center" }}>
                <Space size="middle">
                    <Button onClick={() => {form.resetFields()}}>清空</Button>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Space>
            </div>
            </Space>
        </Form>
    )
}
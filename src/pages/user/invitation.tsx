import { useEffect, useContext, useState } from "react";
import Head from "next/head";
import { Space, Button, Spin } from "antd";
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";
import copy from "copy-to-clipboard";
import UserLayout from "@/components/user-center-layout"
import { PageHeader } from "@/components/page-header";
import { fetchUserInvitationCodes, createUserInvitationCode } from "@/services/user";
import AuthContext from '@/contexts/auth';
import { MessageContext } from '@/contexts/message';
import { shareContent } from "@/utils/share";

const UserInvitationPage = () => {

    const authCtx = useContext(AuthContext);
    const message = useContext(MessageContext);
    const client = authCtx.client;
    const [invitationCode, setInvitationCode] = useState<string>('');
    const supportShare = typeof navigator.share !== "undefined";

    useEffect(() => {
        fetchUserInvitationCodes(client!)
            .then(res => {
                if (res.length > 0) {
                    setInvitationCode(res[0].code);
                }
                else {
                    createUserInvitationCode(client!)
                        .then(res => {
                            setInvitationCode(res.code);
                        })
                        .catch(err => message.error(err));
                }
            })
            .catch(err => message.error(err));
    }, []);

    const shareTitle = "上海交大爱心屋喊你来看看！"
    const shareText = "上海交通大学学生事务中心“绿色爱心屋”是一个慈善捐赠与校内物品循环的公益性平台"
    const shareURL = `${window.location.origin}?share_code=${invitationCode}`

    const share = () => {
        shareContent(shareTitle, shareText, shareURL, true, false)
        .then(() => {
            message.success("分享成功");
        })
        .catch(err => {
            message.error(err);
        })
    }

    const copySlogan = () => {
        copy(`【${shareTitle}】\n${shareText}。点击下方链接使用 jAccount 登录，即可获得爱心币～\n${shareURL}`)
        message.success("已复制到剪贴板");
    }

    return (
        <>
            <Head>
                <title>宣传爱心屋 - 上海交通大学绿色爱心屋</title>
            </Head>
            <UserLayout>
                <PageHeader title={"宣传爱心屋"} />
                <Space direction='vertical' style={{ margin: '18px 12px 0px 12px' }} size='middle'>
                    <div style={{fontSize: '15px'}}>
                        在此获取并分享您的爱心屋邀请链接，在QQ、微信等社交平台宣传爱心屋。通过此链接注册的每一位新用户将为您带来 <b>20</b> 爱心币奖励！
                    </div>
                    {invitationCode && <Space size='middle'>
                        {supportShare && <Button 
                            type='primary' 
                            icon={<ShareAltOutlined />}
                            onClick={share}
                        >
                            一键分享
                        </Button>}
                        <Button 
                            type={supportShare ? 'default' : 'primary'} 
                            icon={<CopyOutlined />}
                            onClick={copySlogan}
                        >
                            复制分享文本
                        </Button>
                    </Space>}
                    {!invitationCode && <Spin/>}
                </Space>
            </UserLayout>
        </>
    );
};

export default UserInvitationPage;
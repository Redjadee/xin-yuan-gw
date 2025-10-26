import { View, Text, Image, Button } from "@tarojs/components";
import { useState } from "react";
import { myImgBase } from "@/global/assets/images/imgBases";
import "./index.scss";

interface MenuItemType {
  label: string;
  path: string;
}

export default function AdminHome() {
  // 数据总览数据
  const [overviewData] = useState({
    alumniCount: "1000人",
    alumniGrowth: "今日新增61%",
    activeRate: "80%",
    activitiesCount: "68",
    registrationRate: "平均报名率90%",
  });

  // 功能菜单项
  const menuItems: MenuItemType[] = [
    { label: "活动设置", path: "/activity-settings" },
    { label: "通知发布", path: "/notification-publish" },
    { label: "学生名单导入", path: "/student-import" },
    { label: "组织设置", path: "/organization-settings" },
    { label: "身份认证审核", path: "/identity-verification" },
    { label: "管理员账号管理", path: "/admin-account-management" },
  ];

  // 渲染数据总览项
  const renderOverviewItem = (
    label: string,
    value: string,
    subValue?: string,
    isPositive?: boolean
  ) => (
    <View className="overview-item">
      <Text className="label">{label}</Text>
      <Text className="value">{value}</Text>
      {subValue && (
        <Text className={`sub-value ${isPositive ? "positive" : "negative"}`}>
          {subValue}
        </Text>
      )}
    </View>
  );

  // 渲染菜单项
  const renderMenuItem = (item: MenuItemType, index: number) => (
    <View className="menu-item" key={index}>
      <Text className="menu-label">{item.label}</Text>
      <Image className="arrow" src={`${myImgBase}/itemArrow.png`} />
    </View>
  );

  return (
    <View className="admin-home">
      {/* 大标题 */}
      <View className="title-box">
        <Text className="title">校友会小程序管理系统</Text>
      </View>
      {/* 数据总览 */}
      <View className="overview-section">
        <View className="section-header">
          <Text className="section-title">数据总览</Text>
          <Button className="download-btn" type="primary" size="mini">
            下载报表
          </Button>
        </View>

        <View className="overview-grid">
          {renderOverviewItem(
            "校友总量",
            overviewData.alumniCount,
            overviewData.alumniGrowth,
            true
          )}
          {renderOverviewItem("7日活跃率", overviewData.activeRate)}
          {renderOverviewItem(
            "活动总量",
            overviewData.activitiesCount,
            overviewData.registrationRate,
            true
          )}
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="menu-section">
        <View className="menu-list">
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>
      </View>

      {/* 退出登录按钮 */}
      <Button className="logout-btn" type="primary">
        退出登录
      </Button>
    </View>
  );
}

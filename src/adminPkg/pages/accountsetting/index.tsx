import { View, Text, Button, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './index.scss';
import { useEffect, useState } from 'react';
import { backArrowB } from '@/global/assets/images/imgBases';
import SwitchButton from '../components/switchbutton';

interface Admin {
  id: string;
  name: string;
  role: string;
  createTime?: string;
}

export default function AccountSetting() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isOperationManager, setIsOperationManager] = useState(false);
  const [isDataManager, setIsDataManager] = useState(false);
  const [isAuditor, setIsAuditor] = useState(false);

  useEffect(() => {
    const router = Taro.getCurrentInstance().router;
    const id = router?.params?.id;
    if (id) {
      // 模拟获取管理员信息
      const mockAdmins: Admin[] = [
        { id: '1', name: '管理员甲', role: '本账号', createTime: '2023-10-01' },
        { id: '2', name: '管理员乙', role: '运营管理员', createTime: '2023-09-15' },
        { id: '3', name: '管理员丙', role: '数据管理员', createTime: '2023-08-20' },
        { id: '4', name: '管理员丁', role: '审核员', createTime: '2023-07-10' },
      ];

      const selectedAdmin = mockAdmins.find(admin => admin.id === id);
      if (selectedAdmin) {
        setAdmin(selectedAdmin);
        setIsDisabled(selectedAdmin.role !== '本账号');
        setIsOperationManager(selectedAdmin.role.includes('运营管理员'));
        setIsDataManager(selectedAdmin.role.includes('数据管理员'));
        setIsAuditor(selectedAdmin.role.includes('审核员'));
      }
    }
  }, []);

  const handleBack = () => {
    Taro.navigateBack({ delta: 1 });
  }

  const handleDeleteAdmin = () => {
    console.log('删除管理员:', admin?.id);
    // 实际项目中这里应该调用API删除
    Taro.navigateBack({ delta: 1 });
  }

  return (
    <View className="account-setting">
      <View className="page-header">
        <Image className="back-arrow" src={backArrowB} onClick={handleBack} />
        <Text className="page-title">{admin?.name}</Text>
      </View>

      <View className="settings">
        <View className="setting-item">
          <Text>禁用账号</Text>
          <SwitchButton checked={isDisabled} onChange={setIsDisabled} />
        </View>
        <View className="setting-item">
          <Text>运营管理员</Text>
          <SwitchButton checked={isOperationManager} onChange={setIsOperationManager} />
        </View>
        <View className="setting-item">
          <Text>数据管理员</Text>
          <SwitchButton checked={isDataManager} onChange={setIsDataManager} />
        </View>
        <View className="setting-item">
          <Text>审核员</Text>
          <SwitchButton checked={isAuditor} onChange={setIsAuditor} />
        </View>
      </View>

      <Button className="delete-admin-btn" onClick={handleDeleteAdmin}>
        删除管理员
      </Button>
    </View>
  );
}
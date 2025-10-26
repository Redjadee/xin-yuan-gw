import { View, Text, Button, Image } from "@tarojs/components"
import { useState, useEffect } from "react"
import Taro from "@tarojs/taro"
import './index.scss'
import { myImgBase, backArrowB } from "@/global/assets/images/imgBases"

interface Admin {
  id: string
  name: string
  role: string
  createTime?: string
}

export default function AccountManager() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 模拟获取管理员列表数据
    const fetchAdmins = async () => {
      try {
        setLoading(true)
        // 模拟异步请求
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockAdmins: Admin[] = [
          { id: '1', name: '管理员甲', role: '本账号', createTime: '2023-10-01' },
          { id: '2', name: '管理员乙', role: '运营管理员', createTime: '2023-09-15' },
          { id: '3', name: '管理员丙', role: '数据管理员', createTime: '2023-08-20' },
          { id: '4', name: '管理员丁', role: '审核员', createTime: '2023-07-10' },
        ]
        
        setAdmins(mockAdmins)
      } catch (err) {
        setError('加载管理员列表失败')
        console.error('加载管理员列表失败:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  const handleAddAdmin = () => {
    console.log('新增管理员')
    // 实际项目中这里可以跳转到添加页面或显示弹窗
  }

  const handleDeleteAdmin = (id: string) => {
    setAdmins(prev => prev.filter(admin => admin.id !== id))
    // 实际项目中这里应该调用API删除
    console.log('删除管理员:', id)
  }

  const handleBack = () => {
    Taro.navigateBack({ delta: 1 })
  }

  return (
    <View className="account-manager">
      <View className="page-header">
        <Image className="back-arrow" src={backArrowB} onClick={handleBack} />
        <Text className="page-title">管理员账号管理</Text>
      </View>

      {loading ? (
        <View className="loading">加载中...</View>
      ) : error ? (
        <View className="error">
          <Text>{error}</Text>
          <Button className="retry-btn" onClick={() => window.location.reload()}>
            重新加载
          </Button>
        </View>
      ) : admins.length > 0 ? (
        <View className="am-list">
          {admins.map((admin) => (
            <View className="am-item" key={admin.id}>
              <View className="info">
                <Text className="name">{admin.name}</Text>
                <Text className="role">{admin.role}</Text>
              </View>
              <Image className="arrow" src={`${myImgBase}/itemArrow.png`} />
            </View>
          ))}
        </View>
      ) : (
        <View className="empty">
          <Text>暂无管理员账号</Text>
        </View>
      )}

      <Button className="add-admin-btn" onClick={handleAddAdmin}>
        新增管理员
      </Button>
    </View>
  )
}
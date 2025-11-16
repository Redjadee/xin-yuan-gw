import { View } from "@tarojs/components"
import AdminButton from "@/adminPkg/components/AdminButton"
import { ITouchEvent } from "@tarojs/components"
import "./index.scss"

interface propsType {
  children: React.ReactNode
  label: string
  className?: string
  onClick?: ((event: ITouchEvent) => void)
}

export default function Layout({ children, className, label, onClick }: propsType) {
  return (
    <View className="admin-bg">
      <View className={`admin ${className}`}>{children}</View>
      <AdminButton label={label} onClick={onClick} />
    </View>
  )
}
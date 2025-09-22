import { View, Text, Form, Input, Button } from "@tarojs/components"
import Title from "@/loginPkg/components/Title"
import Taro from "@tarojs/taro"

import '@/loginPkg/style/form.scss'

export default function Reset() {
  
  return (
    <View className="reset">
      <Title>重置密码</Title>
      <Form>
        <Input placeholderClass="inputPH" className="input" />
        <Input placeholderClass="inputPH" className="input" />
        <Button className="button" ><Text>确定</Text></Button>
      </Form>
    </View>
  )
}
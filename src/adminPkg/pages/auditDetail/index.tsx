import { View, Text, Image } from "@tarojs/components"
import { useState, useEffect, useMemo } from "react"
import { useLoad } from "@tarojs/taro"
import PassReject from "@/adminPkg/components/PassReject"
import { auditDetail, auditAudit } from "@/global/utils/api/usercenter/admin/audit"
import { showMsg } from "@/global/utils/common"
import Taro from "@tarojs/taro"

import './index.scss'

export default function AuditDetail() {
  const [id, setId] = useState('')
  const [auditData, setAuditData] = useState<any>()

  useLoad((options) => {
    if(options.id) setId(options.id)
  })

  // 提取详情中的URL
  const extractUrls = (text: string): string[] => {
    if (!text) return []

    // 匹配以https://testtmp-1385235145.cos.ap-guangzhou.myqcloud.com开头的URL
    const urlRegex = /(https:\/\/testtmp-1385235145\.cos\.ap-guangzhou\.myqcloud\.com[^\s\n]+)/g
    const matches = text.match(urlRegex)
    
    return matches || []
  }

  // 获取提取的URL
  const extractedUrls = useMemo(() => {
    return extractUrls(auditData?.detail || '')
  }, [auditData?.detail])

  // 加载审核详情
  useEffect(() => {
    const loadAuditDetail = async () => {
      if(id) {
        const res = await auditDetail(id)
        if(res?.data) {
          setAuditData(res.data.audit)
        } else {
          if(res) showMsg(res.msg)
        }
      }
    }
    loadAuditDetail()
  }, [id])

  // 通过审核 - status 1
  const handleApprove = async () => {
    if(auditData && id) {
      const res = await auditAudit('', id, 1)
      if(res?.data) {
        showMsg(res.data.message)
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }

  // 拒绝审核 - status 2 with reason
  const handleReject = async (reason: string) => {
    if(auditData && id) {
      const res = await auditAudit(reason, id, 2)
      if(res?.data) {
        showMsg(res.data.message)
        setTimeout(() => {
          Taro.navigateBack()
        }, 1500)
        setTimeout(() => {
          Taro.navigateBack()
        }, 1600);
      } else {
        if(res) showMsg(res.msg)
      }
    }
  }

  return (
    <View className="audit-detail">
      <View className="info-section">
        <Image src={auditData?.avatar || ''} className="avatar" />
        <View className="info-content">
          <Text className="name">{auditData?.name || ''}</Text>
        </View>
      </View>
      <View className="detail-content">
        <Text className="detail-text">
          {auditData?.detail || '暂无详情'}
        </Text>
      </View>

      {/* 显示提取的图片 */}
      {extractedUrls.length > 0 && (
        <View className="image-section">
          <Text className="section-title">相关图片</Text>
          <View className="image-grid">
            {extractedUrls.map((url, index) => (
              <Image
                key={`audit-image-${index}`}
                src={url}
                className="audit-image"
                mode="aspectFit"
                onClick={() => {
                  // 点击图片时预览
                  Taro.previewImage({
                    urls: extractedUrls,
                    current: url
                  })
                }}
              />
            ))}
          </View>
        </View>
      )}
      <PassReject
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    </View>
  )
}
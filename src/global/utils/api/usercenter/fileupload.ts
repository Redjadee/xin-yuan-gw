/**
 * https://cloud.tencent.com/document/product/436/34929
 */

import { http } from "../request"
import Taro from "@tarojs/taro"

export type imageType = 'avatar' | 'article' | 'activity'

// 新的预签名URL返回类型
type PresignedURLResponse = {
  cosHost: string
  cosKey: string
  expires: number
  message: string
  method: string
  presignedURL: string
  securityToken: string
  success: boolean
}

// 对更多字符编码的 url encode 格式
const camSafeUrlEncode = str => {
  return encodeURIComponent(str)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

// 使用预签名URL进行PUT上传
const putFileWithPresignedURL = async (filePath: string, presignedURL: string, securityToken: string) => {
  const wxfs = Taro.getFileSystemManager();
  wxfs.readFile({
    filePath,
    success: function (fileRes) {
      const requestTask = Taro.request({
        url: presignedURL,
        method: 'PUT',
        header: {
          'x-cos-security-token': securityToken,
        },
        data: fileRes.data,
        success: function success(res) {
          // 构建最终访问URL
          const finalURL = presignedURL.split('?')[0]; // 去掉查询参数部分
          if (res.statusCode === 200) {
            Taro.showModal({
              title: '上传成功',
              content: finalURL,
              showCancel: false,
            });
          } else {
            Taro.showModal({
              title: '上传失败',
              content: JSON.stringify(res),
              showCancel: false,
            });
          }
          console.log('上传状态码:', res.statusCode);
          console.log('最终访问URL:', finalURL);
        },
        fail: function fail(res) {
          Taro.showModal({
            title: '上传失败',
            content: JSON.stringify(res),
            showCancel: false,
          });
        },
      });
    },
    fail: function (error) {
      Taro.showModal({
        title: '文件读取失败',
        content: JSON.stringify(error),
        showCancel: false,
      });
    }
  });
};

/**
 * 获取预签名上传URL
 * @param filename 文件名
 * @param imagetype 图片类型: avatar-头像, article-文章图片, activity-活动图片
 * @param articleid 文章/活动ID（可选）
 * @param expires URL过期时间（秒），默认3600秒（1小时）
 * @returns data: { 
 *  cosHost: COS服务地址
 *  cosKey: 文件在COS中的路径
 *  expires: 过期时间（秒）
 *  message: 返回消息
 *  method: HTTP方法（PUT）
 *  presignedURL: 预签名上传URL
 *  securityToken: 安全令牌（临时密钥方式使用）
 *  success: 是否成功
 *  }
 */
async function getPresignedUploadURL(filename: string, imagetype: imageType, articleid?: string, expires?: number) {
  try {
    const res = await http.post(
      '/api/user/fileupload/presigned/url/sts',
      { filename, imagetype, articleid, expires }
    )

    if (res.data && res.data.success) {
      // 使用预签名URL进行上传
      await putFileWithPresignedURL(filename, res.data.presignedURL, res.data.securityToken)
      // 返回最终访问URL
      return res.data.presignedURL.split('?')[0]
    } else {
      throw new Error(res.data?.message || '获取预签名URL失败')
    }
    return res.data
  } catch (error) {
    console.log('获取预签名URL错误:', error)
    Taro.showModal({
      title: '获取上传链接失败',
      content: error.message || '未知错误',
      showCancel: false,
    });
    throw error
  }
}

/**
 * 上传文件（使用预签名URL方式）
 * @param imagetype 图片类型: avatar-头像, article-文章图片, activity-活动图片
 * @param articleid 文章/活动ID（可选）
 * @param expires URL过期时间（秒），默认3600秒（1小时）
 * @returns 最终的文件访问URL
 */
export const fileUpload = async (imagetype: imageType, articleid?: string, expires?: number) => {
  return new Promise((resolve, reject) => {
    // 选择文件
    Taro.chooseMedia({
      count: 1, // 默认9
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: async function (res) {
        try {
          const tempFile = res.tempFiles[0]
          // 从文件路径中提取文件名，如果没有则使用时间戳
          let filename = tempFile.tempFilePath
          const lastSlashIndex = filename.lastIndexOf('/')
          if (lastSlashIndex !== -1) {
            filename = filename.substring(lastSlashIndex + 1)
          }

          // 获取预签名URL并上传
          const finalURL = await getPresignedUploadURL(tempFile.tempFilePath, imagetype, articleid, expires)
          resolve(finalURL)
        } catch (error) {
          reject(error)
        }
      },
      fail: function (error) {
        reject(new Error('选择文件失败: ' + JSON.stringify(error)))
      }
    });
  })
}

// 导出新的接口函数
export { getPresignedUploadURL }
export const fileUpload = async (imagetype: imageType, sizeType: 'compressed'| 'original', articleid?: string) => {
  // 选择文件
  Taro.chooseMedia({
    count: 1, // 默认9
    sizeType: [sizeType],
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      const authData: any = getAuthorization(res.tempFiles[0].tempFilePath, imagetype, articleid)
      // 确认 AuthData 格式是否正确
      console.log(authData)      
    },
  });
}
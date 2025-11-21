/**
 * https://cloud.tencent.com/document/product/436/34929
 */

import { http } from "../request"
import Taro from "@tarojs/taro"

export type imageType = 'avatar' | 'article' | 'activity'

// 新的预签名URL返回类型
type fileReturnType = {
  cosHost: string
  cosKey: string
  expires: number
  finalURL: string
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

// 从微信临时文件路径中提取文件名
const extractFilename = (filePath: string): string => {
  // 微信临时文件路径格式通常是: wxfile://tmp_xxx.jpg 或类似格式
  // 我们只需要文件名部分
  const lastSlashIndex = filePath.lastIndexOf('/');
  const filenameWithQuery = lastSlashIndex !== -1 ? filePath.substring(lastSlashIndex + 1) : filePath;
  // 如果包含查询参数（如 ?timestamp=xxx），只保留文件名部分
  const questionMarkIndex = filenameWithQuery.lastIndexOf('?');
  const filename = questionMarkIndex !== -1 ? filenameWithQuery.substring(0, questionMarkIndex) : filenameWithQuery;

  return filename;
}

const putFile = async (filePath: string, presignedURL: string, securityToken: string): Promise<string> => {
  return new Promise((resolve, reject) => {
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
            const finalURL = presignedURL.split('?')[0]; // 去掉查询参数部分
            if (res.statusCode === 200) {
              Taro.showToast({
                title: '上传成功',
                icon: 'success'
              });
              resolve(finalURL);
            } else {
              Taro.showToast({
                title: '上传失败',
                icon: 'error'
              });
              reject(new Error('上传失败'));
            }
          },
          fail: function fail(res) {
            Taro.showToast({
              title: '上传失败',
              icon: 'error'
            });
            reject(new Error('上传请求失败'));
          },
        });
      },
      fail: function (error) {
        Taro.showToast({
          title: '文件读取失败',
          icon: 'error'
        });
        reject(new Error('文件读取失败'));
      }
    });
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
 *  finalURL: 文件url
 *  message: 返回消息
 *  method: HTTP方法（PUT）
 *  presignedURL: 预签名上传URL
 *  securityToken: 安全令牌（临时密钥方式使用）
 *  success: 是否成功
 *  }
 */
async function getAuthorizationAndUpload(filename: string, tempFilePath: string, imagetype: imageType, articleid?: string): Promise<string> {
  try {
    const res = await http.post(
      '/api/user/fileupload/presigned/url/sts',
      { filename, imagetype, articleid }
    )

    if(res.data && res.data.success) {
      // 使用预签名URL进行上传
      const finalURL = await putFile(tempFilePath, res.data.presignedURL, res.data.securityToken);
      return finalURL;
    } else {
      throw new Error(res.data?.message || '获取预签名URL失败')
    }
  } catch (error) {
    console.log('获取预签名URL错误:', error)
    Taro.showToast({
      title: '获取上传链接失败',
      icon: 'error'
    });
    throw error
  }
}

/**
 * 上传文件
 * @param imagetype 图片类型: avatar-头像, article-文章图片, activity-活动图片
 * @param sizeType 'compressed'| 'original'
 * @param articleid 活动ID（仅活动图片需要）
 * @returns 文件url
 */
export const fileUpload = async (imagetype: imageType, sizeType: 'compressed'| 'original', articleid?: string): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    // 选择文件
    Taro.chooseMedia({
      count: 1, // 默认9
      sizeType: [sizeType],
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: async function (res) {
        try {
          const tempFilePath = res.tempFiles[0].tempFilePath;
          const filename = extractFilename(tempFilePath);

          // 获取预签名URL并上传
          const finalURL = await getAuthorizationAndUpload(filename, tempFilePath, imagetype, articleid);
          resolve(finalURL);
        } catch (error) {
          reject(error)
        }
      },
      fail: function (error) {
        reject(new Error('选择文件失败: ' + JSON.stringify(error)))
      }
    });
  });
}
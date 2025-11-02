/**
 * https://cloud.tencent.com/document/product/436/34929
 */

import { http } from "../request"
import Taro from "@tarojs/taro"

export type imageType = 'avatar' | 'article' | 'activity'
type fileReturnType = {
  authorization: string
  cosHost: string
  cosKey: string
  securityToken: string
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

const putFile = async (prefix: string, filePath: string, key: string, AuthData: fileReturnType) => {
  // put 上传需要读取文件的真实内容来上传
  const wxfs = Taro.getFileSystemManager();
  wxfs.readFile({
    filePath,
    success: function (fileRes) {
      const requestTask = Taro.request({
        url: prefix + '/' + key,
        method: 'PUT',
        header: {
          Authorization: AuthData.authorization,
          'x-cos-security-token': AuthData.securityToken,
        },
        data: fileRes.data,
        success: function success(res) {
          const url = prefix + '/' + camSafeUrlEncode(key).replace(/%2F/g, '/');
          if (res.statusCode === 200) {
            Taro.showModal({
              title: '上传成功',
              content: url,
              showCancel: false,
            });
          } else {
            Taro.showModal({
              title: '上传失败',
              content: JSON.stringify(res),
              showCancel: false,
            });
          }
          console.log(res.statusCode);
          console.log(url);
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
  });
};

// 上传文件
const uploadFile = function (filePath: string, AuthData: fileReturnType) {
  const prefix = 'https://' + AuthData.cosHost;
  const key = AuthData.cosKey;
  putFile(prefix, filePath, key, AuthData);
};

/**
 * 获取上传文件签名
 * @param filename 文件名
 * @param imagetype 图片类型: avatar-头像, article-文章图片, activity-活动图片
 * @param articleid 活动ID（仅活动图片需要）
 * @returns data: { 
 *  authorization 签名信息
 *  cosHost COS主机地址
 *  cosKey 文件路径
 *  securityToken 安全令牌
 *  }
 */
async function getAuthorization(filename: string, imagetype: imageType, articleid?: string) {
  try {
    const res = await http.post(
      '/api/user/fileupload/getuploadsignature',
      { filename, imagetype, articleid }
    )
    if(res.data) {
      uploadFile(filename, res.data)
    }
    return res.data    
  } catch (error) {
    console.log(error)
  }
}

/**
 * 上传文件
 * @param filename 文件名
 * @param imagetype 图片类型: avatar-头像, article-文章图片, activity-活动图片
 * @param articleid 活动ID（仅活动图片需要）
 * @returns data: { 
 *  authorization 签名信息
 *  cosHost COS主机地址
 *  cosKey 文件路径
 *  securityToken 安全令牌
 *  }
 */
export const fileUpload = async (imagetype: imageType, articleid?: string) => {
  // 选择文件
  Taro.chooseMedia({
    count: 1, // 默认9
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      const authData: any = getAuthorization(res.tempFiles[0].tempFilePath, imagetype, articleid)
      // 确认 AuthData 格式是否正确
      console.log(authData)      
    },
  });
}
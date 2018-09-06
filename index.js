//index.js
// 引入腾讯地图SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
// 实例化API核心类
var demo = new QQMapWX({
  key: 'your key' // 必填
});
const app = getApp()
var page = undefined;
var doommList = [];
var i = 0;
//设置数组
class Doomm {
  constructor(text, top, time, color, avatarUrl) {
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.avatarUrl = avatarUrl;
    this.display = true;
    let that = this;
    setTimeout(function() {
      doommList.splice(doommList.indexOf(that), 1);
      page.setData({
        doommData: doommList,
      })
    }, this.time * 10000)
  }
}
//随机颜色
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
Page({
  data: {
    doommData: [],
    usrdoommData: [],
    Interval: '',
    danmuinfo: '',
    senddisabled: true,
    placeholderinfo: '生日快乐！',
    GotUserInfohidden: false,//设置登陆button隐藏
    city:'',//用户所在城市
    add:'',//用户地点,
    danmuzhi:''//弹幕值
  },
  onLoad: function() {
    page = this;
    wx.showShareMenu({
      withShareTicket: true
    })
    //获取用户坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res)
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        // 调用接口反编译地点信息
        demo.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res.result.ad_info.city);
            page.setData({
              add: res.result,
              city: res.result.ad_info.city
            })
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: '请使用位置访问！',
          icon: 'loading',
          duration: 2000
        })
      },

    })
    wx.login({
      success: res => {
        //发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //console.log(res.code)
          var code = res.code; //返回code
          wx.request({
            url: '',
            method: "GET",
            data: {
              code: code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(res) {
              console.log(res.data)
              wx.setStorageSync("openid", res.data)

            },
            fail: function(res) {
              //失败回调
              console.log(res)
            }

          })

        }
      }
    })
    //判断用户是否登陆
    if (wx.getStorageSync('GotUserInfo') == true) {
      page.setData({
        GotUserInfohidden: true
      })
      console.log(page.data.GotUserInfohidden)
      console.log(wx.getStorageInfoSync('GotUserInfo'))
    } else {

    }
    //获取数据库弹幕
    wx.request({
      url: '',
      method: "GET",
      data: {
        switch: true,
      },
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        page.setData({
          danmu: res.data,

        })
        //var jsonData = JSON.stringify(res.data[0].city);
        //var result = $.parseJSON(jsonData);
        console.log(res.data[7].city);
        console.log(typeof([res.data[7].city]));
        var arr = []
        var i = 0;
        //定时一个一个push弹幕信息
        page.data.Interval = setInterval(function() {
          if (i < page.data.danmu.length) {
            i++;
            arr.push(page.data.danmu[i])
            page.setData({
              doommData: arr,
            })
          } else {
            i = 0;
            wx.request({
              url: '',
              method: "GET",
              data: {
                switch: true,
              },
              header: {
                "content-type": "application/x-www-form-urlencoded"
              },
              success: function(res) {
                page.setData({
                  danmu: res.data,
                })
              },
              fail: function(res) {
                console.log(res);
              }
            })
          }
          //console.log(i)
        }, 1500)
      },
      fail: function(res) {
        console.log(res);
      }
    })
  },
  //发送弹幕祝福
  bindbt: function(e) {
    console.log(e.detail.value)
    //当input失去焦点则调用函数发送
    this.setData({
      danmuinfo: e.detail.value
    })
    if (this.data.danmuinfo !== '') {
      this.setData({
        senddisabled: false
      })
      this.send();
    } else {
      this.setData({
        senddisabled: true
      })
    }
  },
  send: function(e) {
    var that = this;
    //console.log(that.data.add)
    //console.log(that.data.city)
    //如果弹幕不为空则将弹幕祝福push数组并赋给usrdoommData，显示用户当前发送弹幕祝福信息
    if (that.data.danmuinfo !== '') {
      doommList.push(new Doomm(wx.getStorageSync('UserInfo').nickName + '在' + that.data.city + '祝培华' + that.data.danmuinfo, Math.ceil(Math.random() * 100), Math.ceil((Math.random() * 2) + 15), '#000000', wx.getStorageSync('UserInfo').avatarUrl));
      that.setData({
        usrdoommData: doommList,
      })
      console.log(doommList);
      //console.log(that.data.city)
      //将用户的弹幕祝福信息上传服务器
      wx.request({
        url: '',
        data: {
          openid: wx.getStorageSync("openid"),
          color: getRandomColor(),
          display: true,
          text: wx.getStorageSync('UserInfo').nickName + '在' + that.data.city + '祝培华' + that.data.danmuinfo,
          time: Math.ceil((Math.random() * 2) + 15),
          top: Math.ceil(Math.random() * 100),
          switch: true,
          city: that.data.add,
          name: wx.getStorageSync('UserInfo').nickName,
          avatarUrl: wx.getStorageSync('UserInfo').avatarUrl
        },
        method: "POST",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          console.log("发送弹幕成功");
          console.log(that.data.add)
          wx.showToast({
            title: '祝福成功',
            icon: 'success',
            duration: 2000
          })
          that.setData({
            senddisabled: true,
            danmuzhi:''
          })
        },
        fail: function (res) {
          console.log("发送弹幕失败");
          wx.showToast({
            title: '祝福失败',
            icon: 'loading',
            duration: 2000
          })
        }

      })
    } else {

    }

    

  },
  //用户授权登陆微信
  onGotUserInfo: function(e) {
    var that = this
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    if (e.detail.errMsg == 'getUserInfo:ok'){
      wx.setStorageSync('UserInfo', e.detail.userInfo)
      wx.setStorageSync('GotUserInfo', true)
      that.setData({
        GotUserInfohidden: true
      })
      
    }
    else{
      this.setData({
        GotUserInfohidden: false
      })
      wx.showToast({
        title: '请登陆！',
        icon: 'loading',
        duration: 2000
      })
    }

    
  },
  onShareAppMessage: function() {
    return {
      title: '祝福培华',
      path: '/pages/90danmu/index',
      success: function(res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;

        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;

          }
        })

      },
      fail: function(res) {
        // 转发失败

      }
    }

  },
  //卸载该页面停止计数
  onUnload() {
    clearTimeout(this.data.Interval);
    console.log("停止计数器");
    this.setData({
      usrdoommData: [],
      danmu: []
    })
    console.log(this.data.doommList)
  },

})
const app = getApp()

function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
  var hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return hexArr.join('');
}

function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("存在非法字符!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}



var CRC8Table=
[						//120424-1			CRC Table
	0x00,0x07,0x0E,0x09,0x1C,0x1B,0x12,0x15,0x38,0x3F,0x36,0x31,0x24,0x23,0x2A,0x2D,
	0x70,0x77,0x7E,0x79,0x6C,0x6B,0x62,0x65,0x48,0x4F,0x46,0x41,0x54,0x53,0x5A,0x5D,
	0xE0,0xE7,0xEE,0xE9,0xFC,0xFB,0xF2,0xF5,0xD8,0xDF,0xD6,0xD1,0xC4,0xC3,0xCA,0xCD,
	0x90,0x97,0x9E,0x99,0x8C,0x8B,0x82,0x85,0xA8,0xAF,0xA6,0xA1,0xB4,0xB3,0xBA,0xBD,
	0xC7,0xC0,0xC9,0xCE,0xDB,0xDC,0xD5,0xD2,0xFF,0xF8,0xF1,0xF6,0xE3,0xE4,0xED,0xEA,
	0xB7,0xB0,0xB9,0xBE,0xAB,0xAC,0xA5,0xA2,0x8F,0x88,0x81,0x86,0x93,0x94,0x9D,0x9A,
	0x27,0x20,0x29,0x2E,0x3B,0x3C,0x35,0x32,0x1F,0x18,0x11,0x16,0x03,0x04,0x0D,0x0A,
	0x57,0x50,0x59,0x5E,0x4B,0x4C,0x45,0x42,0x6F,0x68,0x61,0x66,0x73,0x74,0x7D,0x7A,
	0x89,0x8E,0x87,0x80,0x95,0x92,0x9B,0x9C,0xB1,0xB6,0xBF,0xB8,0xAD,0xAA,0xA3,0xA4,
	0xF9,0xFE,0xF7,0xF0,0xE5,0xE2,0xEB,0xEC,0xC1,0xC6,0xCF,0xC8,0xDD,0xDA,0xD3,0xD4,
	0x69,0x6E,0x67,0x60,0x75,0x72,0x7B,0x7C,0x51,0x56,0x5F,0x58,0x4D,0x4A,0x43,0x44,
	0x19,0x1E,0x17,0x10,0x05,0x02,0x0B,0x0C,0x21,0x26,0x2F,0x28,0x3D,0x3A,0x33,0x34,
	0x4E,0x49,0x40,0x47,0x52,0x55,0x5C,0x5B,0x76,0x71,0x78,0x7F,0x6A,0x6D,0x64,0x63,
	0x3E,0x39,0x30,0x37,0x22,0x25,0x2C,0x2B,0x06,0x01,0x08,0x0F,0x1A,0x1D,0x14,0x13,
	0xAE,0xA9,0xA0,0xA7,0xB2,0xB5,0xBC,0xBB,0x96,0x91,0x98,0x9F,0x8A,0x8D,0x84,0x83,
	0xDE,0xD9,0xD0,0xD7,0xC2,0xC5,0xCC,0xCB,0xE6,0xE1,0xE8,0xEF,0xFA,0xFD,0xF4,0xF3
]





/*******************************************************************************
Function: CRC8cal()
Description:  calculate CRC
Input: 	      pt--data to calculate
          counter--data length
Output: crc8
********************************************************************************/
function CRC8cal(pt, counter)    		   //look-up table calculte CRC 
{    
  var crc8 = 0   
  var i = 0
	for( ; counter > 0; counter--)
	{    
		crc8 = CRC8Table[crc8^pt[i]]   
	  i++    
  }    
  return(crc8)   
}   


var timer1
var B = new Array()
var frameStart = 0
var frameend = 0
var k_p = 0
var Lenth = 0
var Cmd = 0
var headerS = new Array() 
var databufStartS = new Array() 
var databufS = new Array() 
var DataBufX = new Uint8Array()
Page({
  data: {
    devices: [],
    connected: false,
    chs: [],
    BatV:["0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000","0.000"],

    open: true,
    // mark 是指原点x轴坐标
    mark: 0,
    // newmark 是指移动的最新点的x轴坐标 
    newmark: 0,
    istoright: true
  },
  
  openBluetoothAdapter() {
    wx.openBluetoothAdapter({
      success: (res) => {
        console.log('openBluetoothAdapter success', res)
        this.startBluetoothDevicesDiscovery()
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          wx.onBluetoothAdapterStateChange(function (res) {
            console.log('onBluetoothAdapterStateChange', res)
            if (res.available) {
              this.startBluetoothDevicesDiscovery()
            }
          })
        }
      }
    })
  },
  getBluetoothAdapterState() {
    wx.getBluetoothAdapterState({
      success: (res) => {
        console.log('getBluetoothAdapterState', res)
        if (res.discovering) {
          this.onBluetoothDeviceFound()
        } else if (res.available) {
          this.startBluetoothDevicesDiscovery()
        }
      }
    })
  },
  startBluetoothDevicesDiscovery() {
    if (this._discoveryStarted) {
      return
    }
    this._discoveryStarted = true
    wx.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: (res) => {
        console.log('startBluetoothDevicesDiscovery success', res)
        this.onBluetoothDeviceFound()
      },
    })
  },
  stopBluetoothDevicesDiscovery() {
    wx.stopBluetoothDevicesDiscovery()
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound((res) => {
      res.devices.forEach(device => {
        if (!device.name && !device.localName) {
          return
        }
        const foundDevices = this.data.devices
        const idx = inArray(foundDevices, 'deviceId', device.deviceId)
        const data = {}
        if (idx === -1) {
          data[`devices[${foundDevices.length}]`] = device
        } else {
          data[`devices[${idx}]`] = device
        }
        this.setData(data)
      })
    })
  },
  createBLEConnection(e) {
    const ds = e.currentTarget.dataset
    const deviceId = ds.deviceId
    const name = ds.name
    wx.createBLEConnection({
      deviceId,
      success: (res) => {
        this.setData({
          connected: true,
          name,
          deviceId,
        })
        this.getBLEDeviceServices(deviceId)
      }
    })
    this.stopBluetoothDevicesDiscovery()
    this.setData({
      open:false
      })
  },
  closeBLEConnection() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
    this.setData({
      connected: false,
      chs: [],
      canWrite: false,
    })
    clearInterval(timer1)
  },
  getBLEDeviceServices(deviceId) {
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid)
            return
          }
        }
      }
    })
  },
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }
          if (item.properties.write) {
            this.setData({
              canWrite: true
            })
            this._deviceId = deviceId
            this._serviceId = serviceId
            this._characteristicId = item.uuid
            this.writeBLECharacteristicValue()
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }
        }
        this.SendCmd()
      },
      fail(res) {
        console.error('getBLEDeviceCharacteristics', res)
      }
    })
    // 操作之前先监听，保证第一时间获取数据
    wx.onBLECharacteristicValueChange((characteristic) => {
      const idx = inArray(this.data.chs, 'uuid', characteristic.characteristicId)
      const data = {}
      if (idx === -1) {
        data[`chs[${this.data.chs.length}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
      } else {
/*         data[`chs[${idx}]`] = {
          uuid: characteristic.characteristicId,
          value: ab2hex(characteristic.value)
        }
 */       this.DecodeBatteryVol(characteristic.value) 
      }
      // data[`chs[${this.data.chs.length}]`] = {
      //   uuid: characteristic.characteristicId,
      //   value: ab2hex(characteristic.value)
      // }
      this.setData(data)
    })
  },
  writeBLECharacteristicValue() {
    // 向蓝牙设备发送16进制数据
    let buffer = new ArrayBuffer(1)
    var Cmd = new Array(0x0A,0x66,0x0e,0x10,0x01)
    let dataView = new DataView(buffer)
    buffer = new Uint8Array(Cmd).buffer
    wx.writeBLECharacteristicValue({
      deviceId: this._deviceId,
      serviceId: this._serviceId,
      characteristicId: this._characteristicId,
      value: buffer,
    })
  },
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter()
    this._discoveryStarted = false
  },
  
  SendCmd(){
    function SendCmdGetBatteryVoltage(deviceId,serviceId,characteristicId) {
      // 向蓝牙设备发送16进制数据
      let buffer = new ArrayBuffer(5)
      var SendData = new Array(0x0A,0x66,0x20,0x22,0x01)
      let dataView = new DataView(buffer)
      buffer = new Uint8Array(SendData).buffer
      wx.writeBLECharacteristicValue({
        deviceId,
        serviceId,
        characteristicId,
        value: buffer,
      })
      Lenth = SendData[3]
      Cmd = SendData[4]
    }
    timer1=setInterval(SendCmdGetBatteryVoltage,1000,this._deviceId,this._serviceId,this._characteristicId)
  },
  DecodeBatteryVol(databuf){
    var str
    var str1
    var i = 0
    var j = 0
    var k = 0
    B.fill("0.000")
    k = databuf.byteLength
    for(i=0;i<k;i++){
      if(frameStart === 0){
        if(k===1){
          headerS[0] = databuf[0]
          k_p++
        }else{
          var t8 = new Uint8Array(databuf,i++,1)
          headerS[k_p++] = t8[0]
          if(headerS[0]===Lenth){
            var t8 = new Uint8Array(databuf,i++,1)
            headerS[k_p++] = t8[0]
            if(headerS[1] === Cmd){
              frameStart = 1
              var bt = databuf.slice(2)
              databufStartS = new Uint8Array(bt)
              i = i+ databufStartS.byteLength
              k_p = k_p+databufStartS.byteLength
              if(k_p>=Lenth){                 //CRC & frame end 
                k_p = 0;
                frameStart = 0
                for(j= 0;j<databufStartS.byteLength;j++){
                  headerS.push(databufStartS[j])
                }
                DataBufX = headerS
                var CRC = CRC8cal(DataBufX,Lenth)
                if(CRC ===  DataBufX[Lenth]){
                  frameend = 1
                  frameStart = 0
                  break
                }
              }
            }else{
              k_p = 0
              headerS.splice(0,headerS.length)  //清除数组
            }
          }else{
            k_p = 0
            headerS.splice(0,headerS.length)  //清除数组
          }
        }
      }else{
       databufS = new Uint8Array(databuf,i,databuf.byteLength)
        i = i+databufS.byteLength
        k_p = k_p+databufS.byteLength
        if(k_p>=Lenth){                 //CRC & frame end 
          frameStart = 0
          k_p = 0;
          for(j= 0;j<databufStartS.byteLength;j++){
            headerS.push(databufStartS[j])
          }
          for(j= 0;j<databufS.byteLength;j++){
            headerS.push(databufS[j])
          }
          DataBufX = headerS
          var CRC = CRC8cal(DataBufX,Lenth)
          if(CRC ===  DataBufX[Lenth]){
            frameend = 1
            frameStart = 0
            break
          }else{
            frameStart = 0
            DataBufX.splice(0,DataBufX.length)  //清除数组
            headerS.splice(0,headerS.length)  //清除数组
          }
        }
      }
    }
    if(frameend ===1){
      frameend = 0
      var t
      var t0
      var t1
      var tmp
      var tmp0
      j=0
      for(j=0;j<32;j=j+2){
        tmp = DataBufX.slice(2,-1)
        tmp0 = new Uint16Array(tmp)
//        t = tmp0[j]
        t0 = tmp[j]
        t1 = tmp[j+1]
        t = t0*256+t1
        t = t/1000
        t = t.toFixed(3)
        str1 = String(t)
        B[j/2] = str1

      }
      DataBufX.splice(0,DataBufX.length)  //清除数组
      headerS.splice(0,headerS.length)  //清除数组
      this.setData({BatV:B})
    }



  },
  GotoLogin(){

    var app = getApp()
    wx.navigateTo({
      url: '/index/login/login',
    }) 
//    while(app.gloabdata === 0);

  },


  onShow: function() {
    // 页面出现在前台时执行
    console.log("Index onshow，：onShow")
  },
   onReady: function() {
    // 页面首次渲染完毕时执行
    console.log("Index onReady ，：onReady")
    setTimeout(this.openBluetoothAdapter,1000)
 //   this.openBluetoothAdapter()
  },
  onPageScroll: function() {
    // 页面滚动时执行
  },
  onTabItemTap(item) {
    // tab 点击时执行
    console.log("Index on点击 ，：点击")
    console.log(item.index)
    console.log(item.pagePath)
    console.log(item.text)
  },
 


 
  // 点击左上角小图标事件
  tap_ch: function(e) {
    if (this.data.open) {
      this.setData({
        open: false
      });
    } else {
      this.setData({
        open: true
      });
    }
  },
  
  tap_start: function(e) {
    // touchstart事件
    // 把手指触摸屏幕的那一个点的 x 轴坐标赋值给 mark 和 newmark
    this.data.mark = this.data.newmark = e.touches[0].pageX;
  },
  
  tap_drag: function(e) {
    // touchmove事件
    this.data.newmark = e.touches[0].pageX;
     
    // 手指从左向右移动
    if (this.data.mark < this.data.newmark) {
      this.istoright = true;
    }
     
    // 手指从右向左移动
    if (this.data.mark > this.data.newmark) {
      this.istoright = false;
    }
    this.data.mark = this.data.newmark;
  },
  
  tap_end: function(e) {
    // touchend事件
    this.data.mark = 0;
    this.data.newmark = 0;
    // 通过改变 opne 的值，让主页加上滑动的样式
    if (this.istoright) {
      this.setData({
        open: true
      });
    } else {
      this.setData({
        open: false
      });
    }
  }


})
